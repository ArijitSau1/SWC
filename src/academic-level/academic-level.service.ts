import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademicLevel } from './entities/academic-level.entity';
import { CreateAcademicLevelDto } from './dto/create-academic-level.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class AcademicLevelService {
  constructor(
    @InjectRepository(AcademicLevel)
    private readonly academicLevelRepository: Repository<AcademicLevel>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateAcademicLevelDto) {
    const existingLevel = await this.academicLevelRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (existingLevel) {
      throw new ConflictException('Academic level already exists');
    }

    const academicLevel = this.academicLevelRepository.create({
      name: dto.name,
    });

    return this.academicLevelRepository.save(academicLevel);
  }

  async findAll(dto: PaginationDto) {
    const keyword = dto.keyword || '';

    const cacheKey = `academic-levels:${dto.limit}:${dto.offset}:${keyword}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const [result, total] = await this.academicLevelRepository
      .createQueryBuilder('academicLevel')
      .where('academicLevel.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .orderBy('academicLevel.createdAt', 'ASC')
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    const response = {
      result,
      total,
    };

    await this.cacheManager.set(cacheKey, response, 7 * 24 * 60 * 60 * 1000);

    return response;
  }

  async findOne(id: string) {
    const academicLevel = await this.academicLevelRepository.findOne({
      where: { id },
    });

    if (!academicLevel) {
      throw new NotFoundException('Academic level not found');
    }

    return academicLevel;
  }
}
