"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const firebase_service_1 = require("../shared/services/firebase.service");
const storage_service_1 = require("../shared/services/storage.service");
let StoryService = class StoryService {
    constructor(firebaseService, storageService) {
        this.firebaseService = firebaseService;
        this.storageService = storageService;
    }
    async createStory(createStoryDto) {
        const uuid = (0, uuid_1.v4)();
        const imageUrls = await Promise.all(createStoryDto.storyImages.map((image) => this.storageService.uploadFile(image)));
        const storyData = {
            ...createStoryDto,
            storyImages: imageUrls,
            uuid,
            createdAt: new Date().toISOString(),
        };
        await this.firebaseService.create("stories", uuid, storyData);
        return { uuid };
    }
    async getStory(uuid) {
        console.log(await this.firebaseService.get("stories", uuid));
        const story = await this.firebaseService.get("stories", uuid);
        return story
            ? story
            : {
                message: "Story not found",
            };
    }
};
exports.StoryService = StoryService;
exports.StoryService = StoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        storage_service_1.StorageService])
], StoryService);
//# sourceMappingURL=story.service.js.map