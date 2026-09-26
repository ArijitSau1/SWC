import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockTest } from './entities/mock-test.entity';
import { CourseContent } from 'src/course-content/entities/course-content.entity';

import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { CourseContentType } from 'src/enum/course-content-type.enum';

@Injectable()
export class MockTestService {
  constructor(
    @InjectRepository(MockTest)
    private readonly mockTestRepository:
      Repository<MockTest>,

    @InjectRepository(CourseContent)
    private readonly courseContentRepository:
      Repository<CourseContent>,
  ) {}

  async create(dto: CreateMockTestDto) {
    const courseContent =
      await this.courseContentRepository.findOne({
        where: {
          id: dto.courseContentId,
        },
      });

    if (!courseContent) {
      throw new NotFoundException(
        'Course content not found',
      );
    }

    if (
      courseContent.type !==
      CourseContentType.MOCK_TEST
    ) {
      throw new ConflictException(
        'Course content is not a Mock Test',
      );
    }

    const existing =
      await this.mockTestRepository.findOne({
        where: {
          title: dto.title,
          courseContent: {
            id: dto.courseContentId,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'Mock test already exists',
      );
    }

    const mockTest =
      this.mockTestRepository.create({
        title: dto.title,
        description: dto.description,
        duration: dto.duration,
        totalQuestions:
          dto.totalQuestions ?? 0,
        marksPerQuestion:
          dto.marksPerQuestion ?? 1,
        isFree: dto.isFree ?? true,
        courseContent,
      });

    const saved =
      await this.mockTestRepository.save(
        mockTest,
      );

    return {
      id: saved.id,
      title: saved.title,
      description: saved.description,
      duration: saved.duration,
      totalQuestions: saved.totalQuestions,
      marksPerQuestion:
        saved.marksPerQuestion,
      isFree: saved.isFree,
      courseContentId:
        courseContent.id,
    };
  }

  async findByCourseContent(courseContentId: string) {
  const courseContent =
    await this.courseContentRepository.findOne({
      where: {
        id: courseContentId,
      },
    });

  if (!courseContent) {
    throw new NotFoundException(
      'Course content not found',
    );
  }

  const mockTests =
    await this.mockTestRepository
      .createQueryBuilder('mockTest')
      .select([
        'mockTest.id',
        'mockTest.title',
        'mockTest.description',
        'mockTest.duration',
        'mockTest.totalQuestions',
        'mockTest.marksPerQuestion',
        'mockTest.isFree',
        'mockTest.createdAt',
      ])
      .where(
        'mockTest.courseContentId = :courseContentId',
        { courseContentId },
      )
      .orderBy('mockTest.createdAt', 'ASC')
      .getMany();

  return {
    courseContentId,
    total: mockTests.length,
    result: mockTests,
  };
}

async findOne(id: string) {
  const mockTest =
    await this.mockTestRepository
      .createQueryBuilder('mockTest')
      .leftJoinAndSelect(
        'mockTest.courseContent',
        'courseContent',
      )
      .select([
        'mockTest.id',
        'mockTest.title',
        'mockTest.description',
        'mockTest.duration',
        'mockTest.totalQuestions',
        'mockTest.marksPerQuestion',
        'mockTest.isFree',
        'mockTest.createdAt',

        'courseContent.id',
        'courseContent.title',
      ])
      .where('mockTest.id = :id', { id })
      .getOne();

  if (!mockTest) {
    throw new NotFoundException(
      'Mock test not found',
    );
  }

  return mockTest;
}
}
