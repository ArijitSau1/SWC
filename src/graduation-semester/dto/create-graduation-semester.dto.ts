import {
  IsEnum,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

import { GraduationSemesterType } from 'src/enum/graduation-semester.enum';

export class CreateGraduationSemesterDto {
  @IsNotEmpty()
  @IsEnum(GraduationSemesterType)
  name: GraduationSemesterType;

  @IsNotEmpty()
  @IsUUID()
  degreeUniversityId: string;
}