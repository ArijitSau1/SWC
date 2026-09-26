import {
  IsObject,
  IsUUID,
} from 'class-validator';

export class SubmitMockTestDto {
  @IsUUID()
  mockTestId: string;

  @IsObject()
  answers: Record<string, number>;
}