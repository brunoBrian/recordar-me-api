import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { FirebaseService } from "../shared/services/firebase.service";
import { StorageService } from "../shared/services/storage.service";
import { CreateStoryDto } from "./dto/create-story.dto";

@Injectable()
export class StoryService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly storageService: StorageService,
  ) {}

  async createStory(
    createStoryDto: CreateStoryDto,
    files: Array<Express.Multer.File>,
  ) {
    const pLimit = require("p-limit");
    const limit = pLimit(5); // Limit to 5 concurrent uploads

    console.log("--- Inside createStory service method ---");
    console.log(`Received ${files ? files.length : 0} files.`);
    console.log(
      "DTO Received - storyImages:",
      JSON.stringify(createStoryDto.storyImages),
    );
    console.log(
      "DTO Received - specialMoments:",
      JSON.stringify(createStoryDto.specialMoments),
    );

    // Verify if storyImages is a string (single upload) and convert to array
    if (
      createStoryDto.storyImages &&
      typeof createStoryDto.storyImages === "string"
    ) {
      createStoryDto.storyImages = [createStoryDto.storyImages];
    }

    // Verify if specialMoments is a string (single upload in FormData) and convert to array
    // Note: If it comes as JSON string "[...]" it's different, but Multer usually parses multiple fields
    // If it's a single field 'specialMoments' with value '{"...json..."}', it comes as string.
    if (
      createStoryDto.specialMoments &&
      typeof createStoryDto.specialMoments === "string"
    ) {
      // Check if it's a JSON array string or a single JSON object string
      try {
        const parsed = JSON.parse(
          createStoryDto.specialMoments as unknown as string,
        );
        if (Array.isArray(parsed)) {
          createStoryDto.specialMoments = parsed;
        } else {
          createStoryDto.specialMoments = [parsed]; // Or [createStoryDto.specialMoments] if we want to parse later
          // But wait, the existing logic parses later.
          // Let's just wrap in array if it's a single entry string that represents one moment object.
          // Actually the existing logic:
          // if (typeof moment === "string") JSON.parse(moment)
          // This iterates over an ARRAY.
          // So if createStoryDto.specialMoments IS A STRING, we make it an array of strings.
          createStoryDto.specialMoments = [
            createStoryDto.specialMoments,
          ] as any;
        }
      } catch (e) {
        createStoryDto.specialMoments = [createStoryDto.specialMoments] as any;
      }
    }

    // Parse specialMoments if they are strings (coming from FormData as JSON strings)
    if (
      createStoryDto.specialMoments &&
      Array.isArray(createStoryDto.specialMoments)
    ) {
      // 1. Parse strings to objects
      let parsedMoments = createStoryDto.specialMoments.map((moment) => {
        if (typeof moment === "string") {
          try {
            return JSON.parse(moment);
          } catch (e) {
            console.error("Error parsing specialMoment:", e);
            return moment;
          }
        }
        return moment;
      });

      // 2. Deduplicate based on content (title, date, description) to avoid multiple FormData entries causing duplicates
      const seen = new Set();
      parsedMoments = parsedMoments.filter((moment) => {
        const key = `${moment.title}-${moment.date}-${moment.description}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });

      createStoryDto.specialMoments = parsedMoments;
    }

    const uuid = uuidv4();

    if (files) {
      const storyImageFiles = files.filter(
        (f) => f.fieldname === "storyImages",
      );
      if (storyImageFiles.length > 0) {
        console.log("Uploading story images with concurrency limit...");
        const storyImageUrls = await Promise.all(
          storyImageFiles.map((file) =>
            limit(() => this.storageService.uploadFile(file)),
          ),
        );
        createStoryDto.storyImages = storyImageUrls;
        console.log("Story images uploaded.");
      }

      const specialMomentFiles = files.filter((f) =>
        f.fieldname.startsWith("specialMoments"),
      );

      if (specialMomentFiles.length > 0) {
        console.log("Uploading special moment photos...");

        // Map uploads to promises with concurrency limit
        const uploadPromises = specialMomentFiles.map((file) =>
          limit(async () => {
            const match = file.fieldname.match(
              /specialMoments\[(\d+)\]\[photoFile\]/,
            );
            if (match) {
              const index = parseInt(match[1], 10);
              if (
                createStoryDto.specialMoments &&
                createStoryDto.specialMoments[index]
              ) {
                console.log(`Uploading photo for special moment #${index}...`);
                const url = await this.storageService.uploadFile(file);
                createStoryDto.specialMoments[index].photoFile = url;
                console.log(
                  `Photo for special moment #${index} uploaded to ${url}.`,
                );
              }
            }
          }),
        );

        await Promise.all(uploadPromises);
        console.log("Special moment photos uploaded.");
      }
    }

    console.log(
      "--- All uploads finished. Preparing to save to Firestore. ---",
    );

    const storyData = {
      ...createStoryDto,
      uuid,
      createdAt: new Date().toISOString(),
    };

    const payloadSize = JSON.stringify(storyData).length;
    console.log(`Approximate Firestore payload size: ${payloadSize} bytes`);

    if (payloadSize > 1048576) {
      // 1 MiB limit for Firestore documents
      console.error(
        "Error: Firestore payload is larger than 1 MiB. This will likely fail.",
      );
    }

    console.log("Calling firebaseService.create...");
    await this.firebaseService.create("stories", uuid, storyData);
    console.log("firebaseService.create finished.");

    console.log(
      `Story created successfully to uuid ${uuid} with data: ${JSON.stringify(
        storyData,
      )}`,
    );

    return { uuid };
  }

  async getStory(uuid: string) {
    const story = await this.firebaseService.get("stories", uuid);

    return story
      ? story
      : {
          message: "Story not found",
        };
  }
}
