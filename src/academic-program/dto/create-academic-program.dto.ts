import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { AcademicProgramType } from 'src/enum/academic-program.enum';

export class CreateAcademicProgramDto {
  @IsNotEmpty()
  @IsEnum(AcademicProgramType)
  name: AcademicProgramType;

  @IsNotEmpty()
  @IsUUID()
  academicLevelId: string;
}