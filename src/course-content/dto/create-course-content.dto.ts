import { Type } from 'class-transformer';
import {
    IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CourseContentType } from 'src/enum/course-content-type.enum';

export class CreateCourseContentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsEnum(CourseContentType)
  type: CourseContentType;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @IsOptional()
@Type(() => Boolean)
@IsBoolean()
isFree?: boolean;
}