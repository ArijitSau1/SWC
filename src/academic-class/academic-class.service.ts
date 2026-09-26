import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademicClass } from './entities/academic-class.entity';
import { AcademicProgram } from 'src/academic-program/entities/academic-program.entity';
import { CreateAcademicClassDto } from './dto/create-academic-class.dto';

import { AcademicLevelType } from 'src/enum/academic-level.enum';
import { AcademicClassType } from 'src/enum/academic-class.enum';

import { PaginationDto } from 'src/common/dto/pagination.dto';

import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { setCache } from 'src/utils/cache.utils';

@Injectable()
export class AcademicClassService {
  constructor(
    @InjectRepository(AcademicClass)
    private readonly academicClassRepository: Repository<AcademicClass>,

    @InjectRepository(AcademicProgram)
    private readonly academicProgramRepository: Repository<AcademicProgram>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateAcademicClassDto) {
    const academicProgram = await this.academicProgramRepository
      .createQueryBuilder('academicProgram')
      .leftJoinAndSelect('academicProgram.academicLevel', 'academicLevel')
      .where('academicProgram.id = :id', {
        id: dto.academicProgramId,
      })
      .getOne();

    if (!academicProgram) {
      throw new NotFoundException('Academic program not found');
    }

    if (
      academicProgram.academicLevel.name === AcademicLevelType.SECONDARY &&
      [AcademicClassType.CLASS_XI, AcademicClassType.CLASS_XII].includes(
        dto.name,
      )
    ) {
      throw new BadRequestException(
        'Class XI and Class XII are only available under Higher Secondary',
      );
    }

    if (
      academicProgram.academicLevel.name ===
        AcademicLevelType.HIGHER_SECONDARY &&
      [
        AcademicClassType.CLASS_I,
        AcademicClassType.CLASS_II,
        AcademicClassType.CLASS_III,
        AcademicClassType.CLASS_IV,
        AcademicClassType.CLASS_V,
        AcademicClassType.CLASS_VI,
        AcademicClassType.CLASS_VII,
        AcademicClassType.CLASS_VIII,
        AcademicClassType.CLASS_IX,
        AcademicClassType.CLASS_X,
      ].includes(dto.name)
    ) {
      throw new BadRequestException(
        'Class I to Class X are only available under Secondary',
      );
    }

    const existingClass = await this.academicClassRepository
      .createQueryBuilder('academicClass')
      .leftJoin('academicClass.academicProgram', 'academicProgram')
      .where('academicClass.name = :name', {
        name: dto.name,
      })
      .andWhere('academicProgram.id = :academicProgramId', {
        academicProgramId: dto.academicProgramId,
      })
      .getOne();

    if (existingClass) {
      throw new ConflictException(
        'Academic class already exists for this program',
      );
    }

    const academicClass = this.academicClassRepository.create({
      name: dto.name,
      academicProgram,
    });

    return this.academicClassRepository.save(academicClass);
  }

  async findAll(dto: PaginationDto, academicProgramId?: string) {
    const keyword = dto.keyword || '';

    const cacheKey = `academic-classes:${academicProgramId || 'all'}:${dto.limit}:${dto.offset}:${keyword}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query = this.academicClassRepository
      .createQueryBuilder('academicClass')
      .leftJoinAndSelect('academicClass.academicProgram', 'academicProgram')
      .where('academicClass.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });

    if (academicProgramId) {
      query.andWhere('academicProgram.id = :academicProgramId', {
        academicProgramId,
      });
    }

    const [result, total] = await query
      .orderBy('academicClass.createdAt', 'ASC')
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
    const cacheKey = `academic-class:${id}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const academicClass = await this.academicClassRepository
      .createQueryBuilder('academicClass')
      .leftJoinAndSelect('academicClass.academicProgram', 'academicProgram')
      .where('academicClass.id = :id', { id })
      .getOne();

    if (!academicClass) {
      throw new NotFoundException('Academic class not found');
    }

    return setCache(
  this.cacheManager,
  cacheKey,
  academicClass,
);
  }
}
