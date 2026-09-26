import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

import { AcademicStreamType } from 'src/enum/academic-stream.enum';

export class CreateAcademicStreamDto {
  @IsNotEmpty()
  @IsEnum(AcademicStreamType)
  name: AcademicStreamType;

  @IsNotEmpty()
  @IsUUID()
  academicClassId: string;
}