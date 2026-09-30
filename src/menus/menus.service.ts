import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { MenuDto } from './dto/create-manu.dto';


@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu) private readonly repo: Repository<Menu>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}


  async create(menuDto: MenuDto) {
    const menu = this.repo.create(menuDto);

    return this.repo.save(menu);
  }


  async findAll() {
    let menus: Menu[] | undefined = await this.cacheManager.get('menus');
    if (!menus) {
      menus = await this.repo.find();
      this.cacheManager.set('menus', menus, 0);
    }
    return menus;
  }
}