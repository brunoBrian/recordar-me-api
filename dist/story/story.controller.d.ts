import { CreateStoryDto } from "./dto/create-story.dto";
import { StoryService } from "./story.service";
export declare class StoryController {
    private readonly storyService;
    constructor(storyService: StoryService);
    createStory(createStoryDto: CreateStoryDto, files: Record<string, any[]>): Promise<{
        uuid: string;
    }>;
}
