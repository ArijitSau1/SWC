import {
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateDegreeUniversityDto {
  @IsNotEmpty()
  @IsUUID()
  degreeId: string;

  @IsNotEmpty()
  @IsUUID()
  universityId: string;
}