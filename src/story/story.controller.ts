import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Get,
  Param,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateStoryDto } from "./dto/create-story.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { StoryService } from "./story.service";

@ApiTags("stories")
@Controller("story")
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "storyImages", maxCount: 5 }, // Ajuste conforme necessário
      { name: "specialMoments[0][photoFile]", maxCount: 1 }, // Para arquivos específicos
      { name: "specialMoments[1][photoFile]", maxCount: 1 }, // Repetir para cada índice
      { name: "specialMoments[2][photoFile]", maxCount: 1 }, // Repetir para cada índice
      { name: "specialMoments[3][photoFile]", maxCount: 1 }, // Repetir para cada índice
      { name: "specialMoments[4][photoFile]", maxCount: 1 }, // Repetir para cada índice
    ])
  )
  @ApiOperation({ summary: "Create a new story with images" })
  async createStory(
    @Body() createStoryDto: CreateStoryDto,
    @UploadedFiles() files: Record<string, File[]>
  ) {
    // Lógica para mapear arquivos aos momentos
    const specialMoments = createStoryDto?.specialMoments?.map(
      (moment, index) => {
        const parseMoment =
          typeof moment === "string" ? JSON.parse(moment) : moment;

        return {
          id: parseMoment.id,
          title: parseMoment.title,
          date: parseMoment.date,
          description: parseMoment.description,
          photoFile: files[`specialMoments[${index}][photoFile]`]?.[0], // Associa o arquivo ao momento
        };
      }
    );

    const payload = {
      ...createStoryDto,
      storyImages: files.storyImages,
      specialMoments,
    };

    return this.storyService.createStory(payload);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get story by UUID" })
  async getStory(@Param("uuid") uuid: string) {
    return this.storyService.getStory(uuid);
  }
}
