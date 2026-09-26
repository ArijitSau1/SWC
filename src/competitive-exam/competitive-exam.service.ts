import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompetitiveExam } from './entities/competitive-exam.entity';

import { CompetitiveCategory } from 'src/competitive-category/entities/competitive-category.entity';

import { CreateCompetitiveExamDto } from './dto/create-competitive-exam.dto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { setCache } from 'src/utils/cache.utils';

import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CompetitiveExamService {
  constructor(
    @InjectRepository(CompetitiveExam)
    private readonly examRepository: Repository<CompetitiveExam>,

    @InjectRepository(CompetitiveCategory)
    private readonly categoryRepository: Repository<CompetitiveCategory>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateCompetitiveExamDto) {
    const category =
      await this.categoryRepository.findOne({
        where: {
          id: dto.categoryId,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Competitive category not found',
      );
    }

    const existing =
      await this.examRepository.findOne({
        where: {
          name: dto.name,
          category: {
            id: dto.categoryId,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'Competitive exam already exists in this category',
      );
    }

    const exam =
      this.examRepository.create({
        name: dto.name,
        category,
      });

    const saved =
      await this.examRepository.save(exam);

    return {
      id: saved.id,
      name: saved.name,
      categoryId: category.id,
      categoryName: category.name,
    };
  }

  async findAll(dto: PaginationDto) {
    const keyword = dto.keyword || '';

    const cacheKey =
      `competitive-exams:${dto.limit}:${dto.offset}:${keyword}`;

    const cachedData =
      await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const [exams, total] =
      await this.examRepository
        .createQueryBuilder('exam')
        .leftJoin(
          'exam.category',
          'category',
        )
        .select([
          'exam.id',
          'exam.name',
          'exam.createdAt',

          'category.id',
          'category.name',
        ])
        .where(
          'exam.name LIKE :keyword',
          {
            keyword: `%${keyword}%`,
          },
        )
        .orderBy(
          'exam.createdAt',
          'ASC',
        )
        .skip(dto.offset)
        .take(dto.limit)
        .getManyAndCount();

    const result = exams.map((exam) => ({
      id: exam.id,
      name: exam.name,
      categoryId: exam.category?.id || null,
      categoryName:
        exam.category?.name || null,
      createdAt: exam.createdAt,
    }));

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


  async findByCategory(
  categoryId: string,
  dto: PaginationDto,
) {
  const keyword = dto.keyword || '';

  const cacheKey =
    `competitive-exams:category:${categoryId}:${dto.limit}:${dto.offset}:${keyword}`;

  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const category =
    await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });

  if (!category) {
    throw new NotFoundException(
      'Competitive category not found',
    );
  }

  const [exams, total] =
    await this.examRepository
      .createQueryBuilder('exam')
      .leftJoin(
        'exam.category',
        'category',
      )
      .select([
        'exam.id',
        'exam.name',
        'exam.createdAt',

        'category.id',
        'category.name',
      ])
      .where(
        'category.id = :categoryId',
        {
          categoryId,
        },
      )
      .andWhere(
        'exam.name LIKE :keyword',
        {
          keyword: `%${keyword}%`,
        },
      )
      .orderBy(
        'exam.createdAt',
        'ASC',
      )
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

  const result = exams.map((exam) => ({
    id: exam.id,
    name: exam.name,
    categoryId: exam.category?.id || null,
    categoryName:
      exam.category?.name || null,
    createdAt: exam.createdAt,
  }));

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
