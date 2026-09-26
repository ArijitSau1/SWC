import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademicStream } from './entities/academic-stream.entity';
import { AcademicClass } from 'src/academic-class/entities/academic-class.entity';
import { CreateAcademicStreamDto } from './dto/create-academic-stream.dto';

import { AcademicClassType } from 'src/enum/academic-class.enum';

import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { setCache } from 'src/utils/cache.utils';

@Injectable()
export class AcademicStreamService {
  constructor(
    @InjectRepository(AcademicStream)
    private readonly academicStreamRepository: Repository<AcademicStream>,

    @InjectRepository(AcademicClass)
    private readonly academicClassRepository: Repository<AcademicClass>,

     @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateAcademicStreamDto) {
  const academicClass =
    await this.academicClassRepository
      .createQueryBuilder('academicClass')
      .leftJoinAndSelect(
        'academicClass.academicProgram',
        'academicProgram',
      )
      .leftJoinAndSelect(
        'academicProgram.academicLevel',
        'academicLevel',
      )
      .select([
        'academicClass.id',
        'academicClass.name',

        'academicProgram.id',
        'academicProgram.name',

        'academicLevel.id',
        'academicLevel.name',
      ])
      .where('academicClass.id = :id', {
        id: dto.academicClassId,
      })
      .getOne();

  if (!academicClass) {
    throw new NotFoundException(
      'Academic class not found',
    );
  }


  if (
    ![
      AcademicClassType.CLASS_XI,
      AcademicClassType.CLASS_XII,
    ].includes(academicClass.name)
  ) {
    throw new BadRequestException(
      'Streams are only available for Class XI and Class XII',
    );
  }

  
  const existingStream =
    await this.academicStreamRepository
      .createQueryBuilder('academicStream')
      .leftJoin(
        'academicStream.academicClass',
        'academicClass',
      )
      .where('academicStream.name = :name', {
        name: dto.name,
      })
      .andWhere(
        'academicClass.id = :academicClassId',
        {
          academicClassId: dto.academicClassId,
        },
      )
      .getOne();

  if (existingStream) {
    throw new ConflictException(
      'Academic stream already exists for this class',
    );
  }

  const academicStream =
    this.academicStreamRepository.create({
      name: dto.name,
      academicClass,
    });

  const savedStream =
    await this.academicStreamRepository.save(
      academicStream,
    );

  return {
    id: savedStream.id,
    name: savedStream.name,
    academicClassId: academicClass.id,
  };
}

async findAll(academicClassId?: string) {
  const cacheKey =
    `academic-streams:${academicClassId || 'all'}`;

 
  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const query =
    this.academicStreamRepository
      .createQueryBuilder('academicStream')
      .leftJoinAndSelect(
        'academicStream.academicClass',
        'academicClass',
      )
      .orderBy(
        'academicStream.createdAt',
        'ASC',
      );

  if (academicClassId) {
    query.andWhere(
      'academicClass.id = :academicClassId',
      {
        academicClassId,
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
    `academic-stream:${id}`;

  
  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const academicStream =
    await this.academicStreamRepository
      .createQueryBuilder('academicStream')
      .leftJoinAndSelect(
        'academicStream.academicClass',
        'academicClass',
      )
      .where(
        'academicStream.id = :id',
        { id },
      )
      .getOne();

  if (!academicStream) {
    throw new NotFoundException(
      'Academic stream not found',
    );
  }

  
return setCache(
  this.cacheManager,
  cacheKey,
  academicStream,
);
}
}
