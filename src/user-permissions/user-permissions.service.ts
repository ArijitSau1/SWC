
import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserPermissionDto } from './dto/user-permission.dto';
import { UserPermission } from './entities/user-permission.entity';

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly repo: Repository<UserPermission>,
  ) {}

  async create(dto: CreateUserPermissionDto[]) {
    return this.repo.save(dto);
  }
}