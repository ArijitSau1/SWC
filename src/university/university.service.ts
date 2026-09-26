import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { University } from './entities/university.entity';
import { CreateUniversityDto } from './dto/create-university.dto';

import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { setCache } from 'src/utils/cache.utils';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateUniversityDto) {
    const existingUniversity = await this.universityRepository
      .createQueryBuilder('university')
      .where('university.name = :name', {
        name: dto.name,
      })
      .getOne();

    if (existingUniversity) {
      throw new ConflictException('University already exists');
    }

    const university = this.universityRepository.create({
      name: dto.name,
    });

    const savedUniversity = await this.universityRepository.save(university);

    return {
      id: savedUniversity.id,
      name: savedUniversity.name,
    };
  }

  async findAll() {
    const cacheKey = 'universities:all';

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const result = await this.universityRepository
      .createQueryBuilder('university')
      .select(['university.id', 'university.name'])
      .orderBy('university.createdAt', 'ASC')
      .getMany();

    await this.cacheManager.set(cacheKey, result, 7 * 24 * 60 * 60 * 1000);

    return result;
  }

  async findOne(id: string) {
    const cacheKey = `university:${id}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const university = await this.universityRepository
      .createQueryBuilder('university')
      .select(['university.id', 'university.name'])
      .where('university.id = :id', { id })
      .getOne();

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return setCache(this.cacheManager, cacheKey, university);
  }
}
