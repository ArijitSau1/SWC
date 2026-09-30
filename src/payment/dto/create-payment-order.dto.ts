import { IsUUID } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsUUID()
  courseId: string;
}