import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

  @ApiProperty({ type: "string" })
  @IsNotEmpty()
  photoFile?: string;
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
  @IsOptional()
  youtubeUrl: string;

  @ApiProperty({
    type: "string",
    required: false,
    isArray: true,
  })
  storyImages?: string[];

  @ApiProperty({ type: [SpecialMomentDto], required: false })
  specialMoments?: SpecialMomentDto[];

  @ApiProperty()
  @IsOptional()
  animation: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;
}
