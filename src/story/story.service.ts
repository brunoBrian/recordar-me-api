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

  async createStory(createStoryDto: CreateStoryDto) {
    const uuid = uuidv4();

    const specialMomentsWithUrls = createStoryDto.specialMoments
      ? await Promise.all(
          createStoryDto.specialMoments.map(async (moment) => {
            const uploadedPhotoUrl = moment.photoFile
              ? await this.storageService.uploadFile(moment.photoFile)
              : null;

            return {
              ...moment,
              photo: uploadedPhotoUrl,
            };
          })
        )
      : [];

    const storyData = {
      ...createStoryDto,
      uuid,
      specialMoments: specialMomentsWithUrls,
      createdAt: new Date().toISOString(),
    };

    await this.firebaseService.create("stories", uuid, storyData);

    console.log(
      `Story created successfully to uuid ${uuid} with data: ${JSON.stringify(storyData)}`
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
