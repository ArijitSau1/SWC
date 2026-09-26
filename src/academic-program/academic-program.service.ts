import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademicProgram } from './entities/academic-program.entity';
import { AcademicLevel } from 'src/academic-level/entities/academic-level.entity';
import { CreateAcademicProgramDto } from './dto/create-academic-program.dto';

import { AcademicLevelType } from 'src/enum/academic-level.enum';
import { AcademicProgramType } from 'src/enum/academic-program.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { setCache } from 'src/utils/cache.utils';

@Injectable()
export class AcademicProgramService {
  constructor(
    @InjectRepository(AcademicProgram)
    private readonly academicProgramRepository: Repository<AcademicProgram>,

    @InjectRepository(AcademicLevel)
    private readonly academicLevelRepository: Repository<AcademicLevel>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateAcademicProgramDto) {
    const academicLevel = await this.academicLevelRepository.findOne({
      where: {
        id: dto.academicLevelId,
      },
    });

    if (!academicLevel) {
      throw new NotFoundException('Academic level not found');
    }

    const existingProgram = await this.academicProgramRepository
      .createQueryBuilder('academicProgram')
      .leftJoin('academicProgram.academicLevel', 'academicLevel')
      .where('academicProgram.name = :name', {
        name: dto.name,
      })
      .andWhere('academicLevel.id = :academicLevelId', {
        academicLevelId: dto.academicLevelId,
      })
      .getOne();

    if (existingProgram) {
      throw new ConflictException(
        'Academic program already exists for this level',
      );
    }

    if (
      dto.name === AcademicProgramType.WBCHSE &&
      academicLevel.name !== AcademicLevelType.HIGHER_SECONDARY
    ) {
      throw new BadRequestException(
        'WBCHSE is only available under Higher Secondary',
      );
    }

    if (
      dto.name === AcademicProgramType.WBBSE &&
      academicLevel.name !== AcademicLevelType.SECONDARY
    ) {
      throw new BadRequestException('WBBSE is only available under Secondary');
    }

    const academicProgram = this.academicProgramRepository.create({
      name: dto.name,
      academicLevel,
    });

    const savedProgram =
      await this.academicProgramRepository.save(academicProgram);

    return {
      id: savedProgram.id,
      name: savedProgram.name,
      academicLevelId: academicLevel.id,
    };
  }

  async findAll(dto: PaginationDto, academicLevelId?: string) {
    const keyword = dto.keyword || '';

    const cacheKey = `academic-programs:${academicLevelId || 'all'}:${dto.limit}:${dto.offset}:${keyword}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query = this.academicProgramRepository
      .createQueryBuilder('academicProgram')
      .leftJoinAndSelect('academicProgram.academicLevel', 'academicLevel')
      .select([
        'academicProgram.id',
        'academicProgram.name',
        'academicProgram.createdAt',

        'academicLevel.id',
        'academicLevel.name',
      ])
      .where('academicProgram.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .orderBy('academicProgram.createdAt', 'ASC');

    if (academicLevelId) {
      query.andWhere('academicLevel.id = :academicLevelId', {
        academicLevelId,
      });
    }

    const [result, total] = await query
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
    const cacheKey = `academic-program:${id}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const academicProgram = await this.academicProgramRepository
      .createQueryBuilder('academicProgram')
      .leftJoinAndSelect('academicProgram.academicLevel', 'academicLevel')
      .select([
        'academicProgram.id',
        'academicProgram.name',

        'academicLevel.id',
        'academicLevel.name',
      ])
      .where('academicProgram.id = :id', {
        id,
      })
      .getOne();

    if (!academicProgram) {
      throw new NotFoundException('Academic program not found');
    }

    return setCache(
  this.cacheManager,
  cacheKey,
  academicProgram,
);
  }
}
