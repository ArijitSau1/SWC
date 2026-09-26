import { IsEnum, IsNotEmpty } from 'class-validator';
import { AcademicLevelType } from 'src/enum/academic-level.enum';

export class CreateAcademicLevelDto {
  @IsNotEmpty()
  @IsEnum(AcademicLevelType)
  name: AcademicLevelType;
}