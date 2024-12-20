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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const story_service_1 = require("./story.service");
const create_story_dto_1 = require("./dto/create-story.dto");
const swagger_1 = require("@nestjs/swagger");
let StoryController = class StoryController {
    constructor(storyService) {
        this.storyService = storyService;
    }
    async createStory(createStoryDto, files) {
        const storyImages = files.storyImages?.map((file) => file.filename);
        console.log(files.storyImages);
        const payload = {
            ...createStoryDto,
            storyImages: files.storyImages,
        };
        return this.storyService.createStory(payload);
    }
    async getStory(uuid) {
        return this.storyService.getStory(uuid);
    }
};
exports.StoryController = StoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: "storyImages", maxCount: 10 },
    ])),
    (0, swagger_1.ApiOperation)({ summary: "Create a new story with images" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_story_dto_1.CreateStoryDto, Object]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "createStory", null);
__decorate([
    (0, common_1.Get)(":uuid"),
    (0, swagger_1.ApiOperation)({ summary: "Get story by UUID" }),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "getStory", null);
exports.StoryController = StoryController = __decorate([
    (0, swagger_1.ApiTags)("stories"),
    (0, common_1.Controller)("story"),
    __metadata("design:paramtypes", [story_service_1.StoryService])
], StoryController);
//# sourceMappingURL=story.controller.js.map