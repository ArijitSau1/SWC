import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateMockTestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalQuestions?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  marksPerQuestion?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsNotEmpty()
  @IsUUID()
  courseContentId: string;
}