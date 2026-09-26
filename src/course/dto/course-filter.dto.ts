import {
  IsOptional,
  IsUUID,
} from 'class-validator';

import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CourseFilterDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsUUID()
  programId?: string;

  @IsOptional()
  @IsUUID()
  universityId?: string;
}