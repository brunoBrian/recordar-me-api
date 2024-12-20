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
    const imageUrls = await Promise.all(
      createStoryDto?.storyImages?.map((image) =>
        this.storageService.uploadFile(image)
      )
    );

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
      storyImages: imageUrls,
      specialMoments: specialMomentsWithUrls,
      uuid,
      createdAt: new Date().toISOString(),
    };

    await this.firebaseService.create("stories", uuid, storyData);
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
