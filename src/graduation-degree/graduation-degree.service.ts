import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GraduationDegree } from './entities/graduation-degree.entity';
import { CreateGraduationDegreeDto } from './dto/create-graduation-degree.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { setCache } from 'src/utils/cache.utils';

@Injectable()
export class GraduationDegreeService {
  constructor(
    @InjectRepository(GraduationDegree)
    private readonly graduationDegreeRepository: Repository<GraduationDegree>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateGraduationDegreeDto) {
    const existingDegree = await this.graduationDegreeRepository
      .createQueryBuilder('graduationDegree')
      .where('graduationDegree.name = :name', {
        name: dto.name,
      })
      .getOne();

    if (existingDegree) {
      throw new ConflictException('Graduation degree already exists');
    }

    const graduationDegree = this.graduationDegreeRepository.create({
      name: dto.name,
    });

    const savedDegree =
      await this.graduationDegreeRepository.save(graduationDegree);

    return {
      id: savedDegree.id,
      name: savedDegree.name,
    };
  }

  async findAll(dto: PaginationDto) {
    const keyword = dto.keyword || '';

    const cacheKey = `graduation-degrees:${dto.limit}:${dto.offset}:${keyword}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const [result, total] = await this.graduationDegreeRepository
      .createQueryBuilder('graduationDegree')
      .select([
        'graduationDegree.id',
        'graduationDegree.name',
        'graduationDegree.createdAt',
      ])
      .where('graduationDegree.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .orderBy('graduationDegree.createdAt', 'ASC')
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    const response = {
      result,
      total,
    };

    return setCache(this.cacheManager, cacheKey, response);
  }

  async findOne(id: string) {
    const cacheKey = `graduation-degree:${id}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const graduationDegree = await this.graduationDegreeRepository
      .createQueryBuilder('graduationDegree')
      .select(['graduationDegree.id', 'graduationDegree.name'])
      .where('graduationDegree.id = :id', { id })
      .getOne();

    if (!graduationDegree) {
      throw new NotFoundException('Graduation degree not found');
    }

    return setCache(this.cacheManager, cacheKey, graduationDegree);
  }
}
