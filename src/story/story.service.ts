import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { FirebaseService } from "../shared/services/firebase.service";
import { StorageService } from "../shared/services/storage.service";
import { CreateStoryDto } from "./dto/create-story.dto";

@Injectable()
export class StoryService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly storageService: StorageService
  ) {}

  async createStory(
    createStoryDto: CreateStoryDto,
    files: Array<Express.Multer.File>
  ) {
    console.log("--- Inside createStory service method ---");
    console.log(
      "Received createStoryDto:",
      JSON.stringify(createStoryDto, null, 2)
    );
    console.log(`Received ${files ? files.length : 0} files.`);
    if (files) {
      files.forEach((file, index) => {
        console.log(
          `File #${index}: fieldname='${file.fieldname}', originalname='${file.originalname}', size=${file.size}`
        );
      });
    }
    console.log("-----------------------------------------");

    const uuid = uuidv4();

    if (files) {
      const storyImageFiles = files.filter(
        (f) => f.fieldname === "storyImages"
      );
      if (storyImageFiles.length > 0) {
        console.log("Uploading story images...");
        const storyImageUrls = await Promise.all(
          storyImageFiles.map((file) => this.storageService.uploadFile(file))
        );
        createStoryDto.storyImages = storyImageUrls;
        console.log("Story images uploaded.");
      }

      const specialMomentFiles = files.filter((f) =>
        f.fieldname.startsWith("specialMoments")
      );

      if (specialMomentFiles.length > 0) {
        console.log("Uploading special moment photos...");
        for (const file of specialMomentFiles) {
          const match = file.fieldname.match(
            /specialMoments\[(\d+)\]\[photoFile\]/
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
                `Photo for special moment #${index} uploaded to ${url}.`
              );
            }
          }
        }
        console.log("Special moment photos uploaded.");
      }
    }

    console.log(
      "--- All uploads finished. Preparing to save to Firestore. ---"
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
        "Error: Firestore payload is larger than 1 MiB. This will likely fail."
      );
    }

    console.log("Calling firebaseService.create...");
    await this.firebaseService.create("stories", uuid, storyData);
    console.log("firebaseService.create finished.");

    console.log(
      `Story created successfully to uuid ${uuid} with data: ${JSON.stringify(
        storyData
      )}`
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
