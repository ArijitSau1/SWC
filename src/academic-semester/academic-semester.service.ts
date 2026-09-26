import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademicSemester } from './entities/academic-semester.entity';
import { AcademicStream } from 'src/academic-stream/entities/academic-stream.entity';

import { CreateAcademicSemesterDto } from './dto/create-academic-semester.dto';

import { AcademicProgramType } from 'src/enum/academic-program.enum';
import { AcademicClassType } from 'src/enum/academic-class.enum';

import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type{ Cache } from 'cache-manager';
import { setCache } from 'src/utils/cache.utils';


@Injectable()
export class AcademicSemesterService {
  constructor(
    @InjectRepository(AcademicSemester)
    private readonly academicSemesterRepository: Repository<AcademicSemester>,

    @InjectRepository(AcademicStream)
    private readonly academicStreamRepository: Repository<AcademicStream>,

     @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache,
  ) {}

 
  async create(dto: CreateAcademicSemesterDto) {
    
    const academicStream =
      await this.academicStreamRepository
        .createQueryBuilder('academicStream')
        .leftJoinAndSelect(
          'academicStream.academicClass',
          'academicClass',
        )
        .leftJoinAndSelect(
          'academicClass.academicProgram',
          'academicProgram',
        )
        .select([
          'academicStream.id',
          'academicStream.name',

          'academicClass.id',
          'academicClass.name',

          'academicProgram.id',
          'academicProgram.name',
        ])
        .where('academicStream.id = :id', {
          id: dto.academicStreamId,
        })
        .getOne();

    if (!academicStream) {
      throw new NotFoundException(
        'Academic stream not found',
      );
    }

    
    if (
      academicStream.academicClass.academicProgram.name !==
      AcademicProgramType.WBCHSE
    ) {
      throw new BadRequestException(
        'Semesters are only available under WBCHSE',
      );
    }

    
    if (
      ![
        AcademicClassType.CLASS_XI,
        AcademicClassType.CLASS_XII,
      ].includes(academicStream.academicClass.name)
    ) {
      throw new BadRequestException(
        'Semesters are only available for Class XI and Class XII',
      );
    }

    
    const existingSemester =
      await this.academicSemesterRepository
        .createQueryBuilder('academicSemester')
        .leftJoin(
          'academicSemester.academicStream',
          'academicStream',
        )
        .where('academicSemester.name = :name', {
          name: dto.name,
        })
        .andWhere(
          'academicStream.id = :academicStreamId',
          {
            academicStreamId: dto.academicStreamId,
          },
        )
        .getOne();

    if (existingSemester) {
      throw new ConflictException(
        'Academic semester already exists for this stream',
      );
    }

    
    const academicSemester =
      this.academicSemesterRepository.create({
        name: dto.name,
        academicStream,
      });

    
    const savedSemester =
      await this.academicSemesterRepository.save(
        academicSemester,
      );

    
    return {
      id: savedSemester.id,
      name: savedSemester.name,
      academicStreamId: academicStream.id,
    };
  }

  
async findAll(academicStreamId?: string) {
  const cacheKey =
    `academic-semesters:${academicStreamId || 'all'}`;

  
  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const query =
    this.academicSemesterRepository
      .createQueryBuilder('academicSemester')
      .leftJoinAndSelect(
        'academicSemester.academicStream',
        'academicStream',
      )
      .select([
        'academicSemester.id',
        'academicSemester.name',

        'academicStream.id',
        'academicStream.name',
      ])
      .orderBy(
        'academicSemester.createdAt',
        'ASC',
      );

  if (academicStreamId) {
    query.andWhere(
      'academicStream.id = :academicStreamId',
      {
        academicStreamId,
      },
    );
  }

  const result = await query.getMany();

  
return setCache(
  this.cacheManager,
  cacheKey,
  result,
);
}


async findOne(id: string) {
  const cacheKey =
    `academic-semester:${id}`;

  
  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const academicSemester =
    await this.academicSemesterRepository
      .createQueryBuilder('academicSemester')
      .leftJoinAndSelect(
        'academicSemester.academicStream',
        'academicStream',
      )
      .select([
        'academicSemester.id',
        'academicSemester.name',

        'academicStream.id',
        'academicStream.name',
      ])
      .where(
        'academicSemester.id = :id',
        { id },
      )
      .getOne();

  if (!academicSemester) {
    throw new NotFoundException(
      'Academic semester not found',
    );
  }

  
return setCache(
  this.cacheManager,
  cacheKey,
  academicSemester,
);
}
}
