import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './entities/course.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { AcademicClass } from 'src/academic-class/entities/academic-class.entity';
import { AcademicSemester } from 'src/academic-semester/entities/academic-semester.entity';
import { GraduationSemester } from 'src/graduation-semester/entities/graduation-semester.entity';

import { CreateCourseDto } from './dto/create-course.dto';

import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { deleteCacheByPattern, setCache } from 'src/utils/cache.utils';

import { CourseFilterDto } from './dto/course-filter.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,

    @InjectRepository(AcademicClass)
    private readonly academicClassRepository: Repository<AcademicClass>,

    @InjectRepository(AcademicSemester)
    private readonly academicSemesterRepository: Repository<AcademicSemester>,

    @InjectRepository(GraduationSemester)
    private readonly graduationSemesterRepository: Repository<GraduationSemester>,

    @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateCourseDto) {
  

    const subject =
      await this.subjectRepository
        .createQueryBuilder('subject')
        .where('subject.id = :id', {
          id: dto.subjectId,
        })
        .getOne();

    if (!subject) {
      throw new NotFoundException(
        'Subject not found',
      );
    }


    if (
      (dto.academicClassId ||
        dto.academicSemesterId) &&
      dto.graduationSemesterId
    ) {
      throw new BadRequestException(
        'Course cannot belong to both school and graduation',
      );
    }


    if (dto.graduationSemesterId) {
      const graduationSemester =
        await this.graduationSemesterRepository
          .createQueryBuilder(
            'graduationSemester',
          )
          .where(
            'graduationSemester.id = :id',
            {
              id: dto.graduationSemesterId,
            },
          )
          .getOne();

      if (!graduationSemester) {
        throw new NotFoundException(
          'Graduation semester not found',
        );
      }
    }


    let academicClass: AcademicClass | null =
      null;

    if (dto.academicClassId) {
      academicClass =
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
          .where(
            'academicClass.id = :id',
            {
              id: dto.academicClassId,
            },
          )
          .getOne();

      if (!academicClass) {
        throw new NotFoundException(
          'Academic class not found',
        );
      }
    }


    let academicSemester:
      | AcademicSemester
      | null = null;

    if (dto.academicSemesterId) {
      academicSemester =
        await this.academicSemesterRepository
          .createQueryBuilder(
            'academicSemester',
          )
          .leftJoinAndSelect(
            'academicSemester.academicStream',
            'academicStream',
          )
          .leftJoinAndSelect(
            'academicStream.academicClass',
            'academicClass',
          )
          .leftJoinAndSelect(
            'academicClass.academicProgram',
            'academicProgram',
          )
          .where(
            'academicSemester.id = :id',
            {
              id: dto.academicSemesterId,
            },
          )
          .getOne();

      if (!academicSemester) {
        throw new NotFoundException(
          'Academic semester not found',
        );
      }

  
      if (!dto.academicClassId) {
        throw new BadRequestException(
          'Academic class is required when using academic semester',
        );
      }

      if (
        academicSemester.academicStream
          .academicClass.id !==
        dto.academicClassId
      ) {
        throw new BadRequestException(
          'Academic semester does not belong to the selected academic class',
        );
      }


      const program =
        academicSemester.academicStream
          .academicClass.academicProgram;

      if (program.name !== 'WBCHSE') {
        throw new BadRequestException(
          'Academic semester is only available for WBCHSE',
        );
      }
    }


    if (
      !dto.academicClassId &&
      !dto.graduationSemesterId
    ) {
      throw new BadRequestException(
        'Course must belong to an academic class or graduation semester',
      );
    }


    const existing =
      await this.courseRepository
        .createQueryBuilder('course')
        .where(
          'course.title = :title',
          {
            title: dto.title,
          },
        )
        .andWhere(
          'course.subjectId = :subjectId',
          {
            subjectId: dto.subjectId,
          },
        )
        .andWhere(
          dto.graduationSemesterId
            ? 'course.graduationSemesterId = :graduationSemesterId'
            : dto.academicSemesterId
              ? 'course.academicSemesterId = :academicSemesterId'
              : 'course.academicClassId = :academicClassId',
          dto.graduationSemesterId
            ? {
                graduationSemesterId:
                  dto.graduationSemesterId,
              }
            : dto.academicSemesterId
              ? {
                  academicSemesterId:
                    dto.academicSemesterId,
                }
              : {
                  academicClassId:
                    dto.academicClassId,
                },
        )
        .getOne();

    if (existing) {
      throw new ConflictException(
        'Course already exists for this subject and academic context',
      );
    }


    const course =
      this.courseRepository.create({
        title: dto.title,
        thumbnail: dto.thumbnail,
        description: dto.description,
        subject,
        academicClass,
        academicSemester,
        graduationSemester: dto.graduationSemesterId
          ? {
              id: dto.graduationSemesterId,
            }
          : null,
        price: dto.price,
        isFree: dto.isFree
      });

    const savedCourse =
      await this.courseRepository.save(course);

      await deleteCacheByPattern(
  this.cacheManager,
  'courses_v2:*',
);

    return {
      id: savedCourse.id,
      title: savedCourse.title,
      description: savedCourse.description,
      thumbnail: savedCourse.thumbnail,
      price: savedCourse.price,
      isFree: savedCourse.isFree,
      subjectId: subject.id,
      academicClassId:
        academicClass?.id || null,
      academicSemesterId:
        academicSemester?.id || null,
      graduationSemesterId:
        dto.graduationSemesterId || null,
    };
  }


async findAll(dto: CourseFilterDto) {
  const keyword = dto.keyword || '';
  const classId = dto.classId || '';
  const programId = dto.programId || '';
  const universityId = dto.universityId || '';

  const cacheKey =
    `courses_v3:${dto.limit}:${dto.offset}:${keyword}:${classId}:${programId}:${universityId}`;

  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const query =
    this.courseRepository
      .createQueryBuilder('course')

      .leftJoin(
        'course.subject',
        'subject',
      )

      .leftJoin(
        'course.academicClass',
        'academicClass',
      )

      .leftJoin(
        'academicClass.academicProgram',
        'academicProgram',
      )

      .leftJoin(
        'course.academicSemester',
        'academicSemester',
      )

      .leftJoin(
        'course.graduationSemester',
        'graduationSemester',
      )

      .leftJoin(
        'graduationSemester.degreeUniversity',
        'degreeUniversity',
      )

      .leftJoin(
        'degreeUniversity.university',
        'university',
      )

      .select([
        'course.id',
        'course.title',
        'course.thumbnail',
        'course.description',
        'course.price',
        'course.isFree',
        'course.createdAt',

        'subject.id',
        'subject.name',

        'academicClass.id',
        'academicClass.name',

        'academicProgram.id',
        'academicProgram.name',

        'academicSemester.id',
        'academicSemester.name',

        'graduationSemester.id',
        'graduationSemester.name',

        'university.id',
        'university.name',
      ])

      .where(
        'course.title LIKE :keyword',
        {
          keyword: `%${keyword}%`,
        },
      );

  // Class filter
  if (classId) {
    query.andWhere(
      'academicClass.id = :classId',
      { classId },
    );
  }

  // Board filter
  if (programId) {
    query.andWhere(
      'academicProgram.id = :programId',
      { programId },
    );
  }

  // University filter
  if (universityId) {
    query.andWhere(
      'university.id = :universityId',
      { universityId },
    );
  }

  query.orderBy(
    'course.createdAt',
    'DESC',
  );

  const [courses, total] =
    await query
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

  const result = courses.map((course) => ({
    id: course.id,
    title: course.title,
    thumbnail: course.thumbnail,
    description: course.description,
    price: course.price,
    isFree: course.isFree,

    subjectId:
      course.subject?.id || null,

    subjectName:
      course.subject?.name || null,

    academicClassId:
      course.academicClass?.id || null,

    academicClassName:
      course.academicClass?.name || null,

    programId:
      course.academicClass
        ?.academicProgram?.id || null,

    programName:
      course.academicClass
        ?.academicProgram?.name || null,

    academicSemesterId:
      course.academicSemester?.id || null,

    academicSemesterName:
      course.academicSemester?.name || null,

    graduationSemesterId:
      course.graduationSemester?.id || null,

    graduationSemesterName:
      course.graduationSemester?.name || null,

    universityId:
      course.graduationSemester
        ?.degreeUniversity
        ?.university?.id || null,

    universityName:
      course.graduationSemester
        ?.degreeUniversity
        ?.university?.name || null,
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

async findOne(id: string) {
  const cacheKey = `course_v1:${id}`;

  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const course =
    await this.courseRepository
      .createQueryBuilder('course')

      .leftJoin('course.subject', 'subject')
      .leftJoin('course.academicClass', 'academicClass')
      .leftJoin(
        'course.academicSemester',
        'academicSemester',
      )
      .leftJoin(
        'course.graduationSemester',
        'graduationSemester',
      )

      .select([
        'course.id',
        'course.title',
        'course.thumbnail',
        'course.description',
        'course.price',
        'course.isFree',
        'course.createdAt',
        'course.updatedAt',

        'subject.id',
        'subject.name',

        'academicClass.id',
        'academicClass.name',

        'academicSemester.id',
        'academicSemester.name',

        'graduationSemester.id',
        'graduationSemester.name',
      ])

      .where('course.id = :id', { id })
      .getOne();

  if (!course) {
    throw new NotFoundException(
      'Course not found',
    );
  }

  const result = {
    id: course.id,
    title: course.title,
    thumbnail: course.thumbnail,
    description: course.description,
    price: course.price,
    isFree: course.isFree,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,

    subjectId: course.subject?.id || null,
    subjectName: course.subject?.name || null,

    academicClassId:
      course.academicClass?.id || null,

    academicClassName:
      course.academicClass?.name || null,

    academicSemesterId:
      course.academicSemester?.id || null,

    academicSemesterName:
      course.academicSemester?.name || null,

    graduationSemesterId:
      course.graduationSemester?.id || null,

    graduationSemesterName:
      course.graduationSemester?.name || null,
  };

  return setCache(
    this.cacheManager,
    cacheKey,
    result,
  );
}
}
