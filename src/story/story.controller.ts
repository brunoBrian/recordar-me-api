import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Get,
  Param,
  UploadedFile,
} from "@nestjs/common";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { CreateStoryDto } from "./dto/create-story.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { StoryService } from "./story.service";
import { StorageService } from "src/shared/services/storage.service";
import { File } from "buffer";

@ApiTags("stories")
@Controller("story")
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    private readonly storageService: StorageService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new story with images" })
  async createStory(@Body() createStoryDto: CreateStoryDto) {
    console.log(createStoryDto);

    return this.storyService.createStory(createStoryDto);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get story by UUID" })
  async getStory(@Param("uuid") uuid: string) {
    return this.storyService.getStory(uuid);
  }

  @Post("/upload/image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: File) {
    console.log(`Fazendo upload`);
    const uploadedUrl = await this.storageService.uploadFile(file);

    console.log(`Upload url: ${uploadedUrl}`);

    return { url: uploadedUrl };
  }
}
