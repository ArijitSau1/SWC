import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CourseContent } from './entities/course-content.entity';
import { Course } from 'src/course/entities/course.entity';

import { CreateCourseContentDto } from './dto/create-course-content.dto';

import { BunnyService } from 'src/bunny/bunny.service';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { deleteCacheByPattern, setCache } from 'src/utils/cache.utils';
import { CourseContentType } from 'src/enum/course-content-type.enum';

@Injectable()
export class CourseContentService {
  constructor(
    @InjectRepository(CourseContent)
    private readonly courseContentRepository:
      Repository<CourseContent>,

    @InjectRepository(Course)
    private readonly courseRepository:
      Repository<Course>,

    private readonly bunnyService: BunnyService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(
    dto: CreateCourseContentDto,
    file: Express.Multer.File,
  ) {
    
    const course =
      await this.courseRepository.findOne({
        where: {
          id: dto.courseId,
        },
      });

    if (!course) {
      throw new NotFoundException(
        'Course not found',
      );
    }

    
    const existing =
      await this.courseContentRepository.findOne({
        where: {
          title: dto.title,
          course: {
            id: dto.courseId,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'Course content already exists',
      );
    }

    
    const filePath =
      await this.bunnyService.uploadFile(
        file,
        'CourseContent',
      );

    
    const content =
      this.courseContentRepository.create({
        title: dto.title,
        type: dto.type,
        duration: dto.duration,

        url:
          process.env.RE_CDN_LINK +
          filePath,

        course,
        isFree: dto.isFree ?? true,
      });

    const saved =
      await this.courseContentRepository.save(
        content,
      );

await deleteCacheByPattern(
  this.cacheManager,
  `course-contents_v3:${course.id}:*`,
);

    return {
      id: saved.id,
      title: saved.title,
      type: saved.type,
      url: saved.url,
      duration: saved.duration,
      courseId: course.id,
      isFree: saved.isFree,
    };
  }


  async findByCourse(
  courseId: string,
  type?: CourseContentType,
) {
  const cacheKey =
  `course-contents_v3:${courseId}:${type || 'all'}`;

  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const course =
    await this.courseRepository.findOne({
      where: {
        id: courseId,
      },
    });

  if (!course) {
    throw new NotFoundException(
      'Course not found',
    );
  }

  const query =
  this.courseContentRepository
    .createQueryBuilder('content')
    .select([
      'content.id',
      'content.title',
      'content.type',
      'content.url',
      'content.duration',
      'content.createdAt',
      'content.isFree',
    ])
    .where(
      'content.courseId = :courseId',
      { courseId },
    );

if (type) {
  query.andWhere(
    'content.type = :type',
    { type },
  );
}

const contents =
  await query
    .orderBy(
      'content.createdAt',
      'ASC',
    )
    .getMany();

  const result = {
    courseId,
    result: contents,
    total: contents.length,
  };

  return setCache(
    this.cacheManager,
    cacheKey,
    result,
  );
}


async createMockTestContent(
  dto: CreateCourseContentDto,
) {
  const course =
    await this.courseRepository.findOne({
      where: {
        id: dto.courseId,
      },
    });

  if (!course) {
    throw new NotFoundException(
      'Course not found',
    );
  }

  if (dto.type !== CourseContentType.MOCK_TEST) {
    throw new BadRequestException(
      'Content type must be Mock Test',
    );
  }

  const existing =
    await this.courseContentRepository.findOne({
      where: {
        title: dto.title,
        course: {
          id: dto.courseId,
        },
      },
    });

  if (existing) {
    throw new ConflictException(
      'Course content already exists',
    );
  }

  const content =
    this.courseContentRepository.create({
      title: dto.title,
      type: CourseContentType.MOCK_TEST,
      isFree: dto.isFree ?? true,
      course,
    });

  const saved =
    await this.courseContentRepository.save(
      content,
    );

  return {
    id: saved.id,
    title: saved.title,
    type: saved.type,
    isFree: saved.isFree,
    courseId: course.id,
  };
}
}