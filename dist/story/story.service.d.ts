import { FirebaseService } from "../shared/services/firebase.service";
import { StorageService } from "../shared/services/storage.service";
export declare class StoryService {
    private readonly firebaseService;
    private readonly storageService;
    constructor(firebaseService: FirebaseService, storageService: StorageService);
    createStory(createStoryDto: any): Promise<{
        uuid: string;
    }>;
    getStory(uuid: string): Promise<any>;
}
