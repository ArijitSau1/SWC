import { IsEnum, IsNotEmpty } from 'class-validator';

import { GraduationDegreeType } from 'src/enum/graduation-degree.enum';

export class CreateGraduationDegreeDto {
  @IsNotEmpty()
  @IsEnum(GraduationDegreeType)
  name: GraduationDegreeType;
}