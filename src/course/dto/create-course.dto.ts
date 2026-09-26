import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @IsOptional()
  @IsUUID()
  academicClassId?: string;

  @IsOptional()
  @IsUUID()
  academicSemesterId?: string;

  @IsOptional()
  @IsUUID()
  graduationSemesterId?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  isFree: boolean;
}