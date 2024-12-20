import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { StoryService } from "./story.service";
import { CreateStoryDto } from "./dto/create-story.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("stories")
@Controller("story")
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "storyImages", maxCount: 10 }, // Ajuste conforme necessário
    ])
  )
  @ApiOperation({ summary: "Create a new story with images" })
  async createStory(
    @Body() createStoryDto: CreateStoryDto,
    @UploadedFiles()
    files: {
      storyImages?: any[];
    }
  ) {
    // Converte os arquivos para um array de strings (ex.: URLs ou caminhos)
    const storyImages = files.storyImages?.map((file) => file.filename); // Ajuste para o que for necessário (ex.: URLs)

    console.log(files.storyImages);

    // Adiciona os campos ao DTO
    const payload = {
      ...createStoryDto,
      storyImages: files.storyImages,
    };

    return this.storyService.createStory(payload);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get story by UUID" })
  async getStory(@Param("uuid") uuid: string) {
    return this.storyService.getStory(uuid);
  }
}
