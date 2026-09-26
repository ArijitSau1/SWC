import {
  IsEnum,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

import { AcademicClassType } from 'src/enum/academic-class.enum';

export class CreateAcademicClassDto {
  @IsNotEmpty()
  @IsEnum(AcademicClassType)
  name: AcademicClassType;

  @IsNotEmpty()
  @IsUUID()
  academicProgramId: string;
}