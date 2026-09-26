import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { setCache } from 'src/utils/cache.utils';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}



  async create(dto: CreateSubjectDto) {
    const existing =
      await this.subjectRepository
        .createQueryBuilder('subject')
        .where('subject.name = :name', {
          name: dto.name,
        })
        .getOne();

    if (existing) {
      throw new ConflictException(
        'Subject already exists',
      );
    }

    const subject =
      this.subjectRepository.create(dto);

    return this.subjectRepository.save(subject);
  }



  async findAll(dto: PaginationDto) {
    const keyword = dto.keyword || '';

    const cacheKey = `subjects:${dto.limit}:${dto.offset}:${keyword}`;

    const cachedData =
      await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query =
      this.subjectRepository
        .createQueryBuilder('subject')
        .select([
          'subject.id',
          'subject.name',
          'subject.description',
          'subject.image',
          'subject.createdAt',
        ])
        .where(
          'subject.name LIKE :keyword',
          {
            keyword: `%${keyword}%`,
          },
        )
        .orderBy(
          'subject.createdAt',
          'DESC',
        );

    const [result, total] =
      await query
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


  async findOne(id: string) {
    const cacheKey = `subject:${id}`;

    const cachedData =
      await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const subject =
      await this.subjectRepository
        .createQueryBuilder('subject')
        .select([
          'subject.id',
          'subject.name',
          'subject.description',
          'subject.image',
          'subject.createdAt',
          'subject.updatedAt',
        ])
        .where('subject.id = :id', {
          id,
        })
        .getOne();

    if (!subject) {
      throw new NotFoundException(
        'Subject not found',
      );
    }

    return setCache(
      this.cacheManager,
      cacheKey,
      subject,
    );
  }

}