import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateMockTestQuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @IsInt()
  @Min(0)
  correctAnswer: number;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsNotEmpty()
  @IsUUID()
  mockTestId: string;
}