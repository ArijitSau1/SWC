import { Type } from 'class-transformer';
import {IsNotEmpty,IsNumber,IsUUID} from 'class-validator';

export class CreateUserPermissionDto {
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  menuId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  permissionId: number;
}