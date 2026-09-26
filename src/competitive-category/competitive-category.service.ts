import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompetitiveCategory } from './entities/competitive-category.entity';

import { CreateCompetitiveCategoryDto } from './dto/create-competitive-category.dto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { setCache } from 'src/utils/cache.utils';

import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CompetitiveCategoryService {
  constructor(
    @InjectRepository(CompetitiveCategory)
    private readonly categoryRepository:
      Repository<CompetitiveCategory>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(
    dto: CreateCompetitiveCategoryDto,
  ) {
    const existing =
      await this.categoryRepository.findOne({
        where: {
          name: dto.name,
        },
      });

    if (existing) {
      throw new ConflictException(
        'Competitive category already exists',
      );
    }

    const category =
      this.categoryRepository.create({
        name: dto.name,
      });

    const saved =
      await this.categoryRepository.save(
        category,
      );

    return {
      id: saved.id,
      name: saved.name,
    };
  }

  async findAll(dto: PaginationDto) {
    const keyword = dto.keyword || '';

    const cacheKey =
      `competitive-categories:${dto.limit}:${dto.offset}:${keyword}`;

    
    const cachedData =
      await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    
    const [result, total] =
      await this.categoryRepository
        .createQueryBuilder(
          'competitiveCategory',
        )
        .select([
          'competitiveCategory.id',
          'competitiveCategory.name',
          'competitiveCategory.createdAt',
        ])
        .where(
          'competitiveCategory.name LIKE :keyword',
          {
            keyword: `%${keyword}%`,
          },
        )
        .orderBy(
          'competitiveCategory.createdAt',
          'ASC',
        )
        .skip(dto.offset)
        .take(dto.limit)
        .getManyAndCount();

    const response = {
      result,
      total,
    };

    
    return setCache(
      this.cacheManager,
      cacheKey,
      response,
    );
  }
}
