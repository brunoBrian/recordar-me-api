import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class SpecialMomentDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: "string", format: "binary" }) // Indica que será um arquivo
  @IsNotEmpty()
  photoFile?: any; // Aceita o arquivo
}

export class CreateStoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  coupleName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  relationshipStartDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  relationshipStartTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  selectedPlan: string;

  @ApiProperty()
  // @ValidateNested({ each: true })
  // @Type(() => SpecialMomentDto)
  specialMoments: SpecialMomentDto[];

  @ApiProperty()
  @IsOptional()
  youtubeUrl: string;

  @ApiProperty()
  @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  storyImages: any;
}
