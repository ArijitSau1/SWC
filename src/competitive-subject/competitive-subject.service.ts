import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompetitiveSubject } from './entities/competitive-subject.entity';
import { CompetitiveExam } from 'src/competitive-exam/entities/competitive-exam.entity';

import { CreateCompetitiveSubjectDto } from './dto/create-competitive-subject.dto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { setCache } from 'src/utils/cache.utils';

import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CompetitiveSubjectService {
  constructor(
    @InjectRepository(CompetitiveSubject)
    private readonly subjectRepository:
      Repository<CompetitiveSubject>,

    @InjectRepository(CompetitiveExam)
    private readonly examRepository:
      Repository<CompetitiveExam>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateCompetitiveSubjectDto) {
    const exam =
      await this.examRepository.findOne({
        where: {
          id: dto.examId,
        },
      });

    if (!exam) {
      throw new NotFoundException(
        'Competitive exam not found',
      );
    }

    const existing =
      await this.subjectRepository.findOne({
        where: {
          name: dto.name,
          exam: {
            id: dto.examId,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'Subject already exists for this exam',
      );
    }

    const subject =
      this.subjectRepository.create({
        name: dto.name,
        exam,
      });

    const saved =
      await this.subjectRepository.save(subject);

    return {
      id: saved.id,
      name: saved.name,
      examId: exam.id,
      examName: exam.name,
    };
  }

  async findByExam(
    examId: string,
    dto: PaginationDto,
  ) {
    const keyword = dto.keyword || '';

    const cacheKey =
      `competitive-subjects:exam:${examId}:${dto.limit}:${dto.offset}:${keyword}`;

    const cachedData =
      await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const exam =
      await this.examRepository.findOne({
        where: {
          id: examId,
        },
      });

    if (!exam) {
      throw new NotFoundException(
        'Competitive exam not found',
      );
    }

    const [subjects, total] =
      await this.subjectRepository
        .createQueryBuilder('subject')
        .leftJoin(
          'subject.exam',
          'exam',
        )
        .select([
          'subject.id',
          'subject.name',
          'subject.createdAt',

          'exam.id',
          'exam.name',
        ])
        .where(
          'exam.id = :examId',
          {
            examId,
          },
        )
        .andWhere(
          'subject.name LIKE :keyword',
          {
            keyword: `%${keyword}%`,
          },
        )
        .orderBy(
          'subject.createdAt',
          'ASC',
        )
        .skip(dto.offset)
        .take(dto.limit)
        .getManyAndCount();

    const result = subjects.map(
      (subject) => ({
        id: subject.id,
        name: subject.name,
        examId: subject.exam?.id || null,
        examName:
          subject.exam?.name || null,
        createdAt: subject.createdAt,
      }),
    );

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
