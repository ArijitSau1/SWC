import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateUniversityDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}