import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GraduationSemester } from './entities/graduation-semester.entity';
import { DegreeUniversity } from 'src/degree-university/entities/degree-university.entity';

import { CreateGraduationSemesterDto } from './dto/create-graduation-semester.dto';

import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { setCache } from 'src/utils/cache.utils';

@Injectable()
export class GraduationSemesterService {
  constructor(
    @InjectRepository(GraduationSemester)
    private readonly semesterRepository: Repository<GraduationSemester>,

    @InjectRepository(DegreeUniversity)
    private readonly degreeUniversityRepository: Repository<DegreeUniversity>,

      @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache,
  ) {}

 
  async create(
    dto: CreateGraduationSemesterDto,
  ) {
    
    const degreeUniversity =
      await this.degreeUniversityRepository
        .createQueryBuilder('degreeUniversity')
        .leftJoinAndSelect(
          'degreeUniversity.degree',
          'degree',
        )
        .leftJoinAndSelect(
          'degreeUniversity.university',
          'university',
        )
        .where(
          'degreeUniversity.id = :id',
          {
            id: dto.degreeUniversityId,
          },
        )
        .getOne();

    if (!degreeUniversity) {
      throw new NotFoundException(
        'Degree-university relationship not found',
      );
    }

    
    const existingSemester =
      await this.semesterRepository
        .createQueryBuilder('semester')
        .where(
          'semester.name = :name',
          {
            name: dto.name,
          },
        )
        .andWhere(
          'semester.degreeUniversityId = :degreeUniversityId',
          {
            degreeUniversityId:
              dto.degreeUniversityId,
          },
        )
        .getOne();

    if (existingSemester) {
      throw new ConflictException(
        'This semester already exists for this degree and university',
      );
    }

    
    const semester =
      this.semesterRepository.create({
        name: dto.name,
        degreeUniversity,
      });

    
    const savedSemester =
      await this.semesterRepository.save(
        semester,
      );

    
    return {
      id: savedSemester.id,
      name: savedSemester.name,
      degreeUniversityId:
        degreeUniversity.id,
    };
  }

  
  async findAll(
  degreeUniversityId?: string,
) {
  const cacheKey =
    `graduation-semesters:${degreeUniversityId || 'all'}`;

  
  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const query =
    this.semesterRepository
      .createQueryBuilder('semester')
      .leftJoinAndSelect(
        'semester.degreeUniversity',
        'degreeUniversity',
      )
      .leftJoinAndSelect(
        'degreeUniversity.degree',
        'degree',
      )
      .leftJoinAndSelect(
        'degreeUniversity.university',
        'university',
      )
      .select([
        'semester.id',
        'semester.name',

        'degreeUniversity.id',

        'degree.id',
        'degree.name',

        'university.id',
        'university.name',
      ])
      .orderBy(
        'semester.name',
        'ASC',
      );

  if (degreeUniversityId) {
    query.andWhere(
      'degreeUniversity.id = :degreeUniversityId',
      {
        degreeUniversityId,
      },
    );
  }

  const result = await query.getMany();

  
  await this.cacheManager.set(
    cacheKey,
    result,
    7 * 24 * 60 * 60 * 1000,
  );

  return result;
}

  
 async findOne(id: string) {
  const cacheKey =
    `graduation-semester:${id}`;

  
  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const semester =
    await this.semesterRepository
      .createQueryBuilder('semester')
      .leftJoinAndSelect(
        'semester.degreeUniversity',
        'degreeUniversity',
      )
      .leftJoinAndSelect(
        'degreeUniversity.degree',
        'degree',
      )
      .leftJoinAndSelect(
        'degreeUniversity.university',
        'university',
      )
      .select([
        'semester.id',
        'semester.name',

        'degreeUniversity.id',

        'degree.id',
        'degree.name',

        'university.id',
        'university.name',
      ])
      .where(
        'semester.id = :id',
        { id },
      )
      .getOne();

  if (!semester) {
    throw new NotFoundException(
      'Graduation semester not found',
    );
  }

  
return setCache(
  this.cacheManager,
  cacheKey,
  semester,
);
}
}
