import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

import { AcademicSemesterType } from 'src/enum/academic-semester.enum';

export class CreateAcademicSemesterDto {
  @IsNotEmpty()
  @IsEnum(AcademicSemesterType)
  name: AcademicSemesterType;

  @IsNotEmpty()
  @IsUUID()
  academicStreamId: string;
}