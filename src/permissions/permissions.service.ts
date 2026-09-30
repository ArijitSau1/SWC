import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission) private readonly repo: Repository<Permission>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(@Body() createPermissionDto:CreatePermissionDto){
    const permission = this.repo.create(createPermissionDto);
    return this.repo.save(permission);
  }

  
  async findAll() {
    let perms: Permission[] | undefined = await this.cacheManager.get('perms');
    if (!perms) {
      perms = await this.repo.find();
      await this.cacheManager.set('perms', perms, 0);
    }
    return perms;
  }
}
