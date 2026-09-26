import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCompetitiveCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}