import { StoryService } from "./story.service";
import { CreateStoryDto } from "./dto/create-story.dto";
export declare class StoryController {
    private readonly storyService;
    constructor(storyService: StoryService);
    createStory(createStoryDto: CreateStoryDto, files: {
        storyImages?: any[];
    }): Promise<{
        uuid: string;
    }>;
    getStory(uuid: string): Promise<any>;
}
