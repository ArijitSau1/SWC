import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockTestQuestion } from './entities/mock-test-question.entity';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { CreateMockTestQuestionDto } from './dto/create-mock-test-question.dto';


import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { setCache } from 'src/utils/cache.utils';



@Injectable()
export class MockTestQuestionService {
  constructor(
    @InjectRepository(MockTestQuestion)
    private readonly questionRepository: Repository<MockTestQuestion>,

    @InjectRepository(MockTest)
    private readonly mockTestRepository: Repository<MockTest>,

    @Inject(CACHE_MANAGER)
private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateMockTestQuestionDto) {
  const mockTest =
    await this.mockTestRepository.findOne({
      where: {
        id: dto.mockTestId,
      },
    });

  if (!mockTest) {
    throw new NotFoundException(
      'Mock test not found',
    );
  }

  
  if (
    dto.correctAnswer < 0 ||
    dto.correctAnswer >= dto.options.length
  ) {
    throw new ConflictException(
      'Correct answer index is invalid',
    );
  }

  
  const duplicateOptionsCheck = dto.options.map(
    (option) => option.trim().toLowerCase(),
  );

  const uniqueOptions = new Set(
    duplicateOptionsCheck,
  );

  if (
    uniqueOptions.size !==
    dto.options.length
  ) {
    throw new ConflictException(
      'Duplicate options are not allowed',
    );
  }

  const question =
    this.questionRepository.create({
      question: dto.question,
      options: dto.options,
      correctAnswer: dto.correctAnswer,
      explanation: dto.explanation,
      mockTest,
    });

  const saved =
    await this.questionRepository.save(
      question,
    );

  mockTest.totalQuestions += 1;

  await this.mockTestRepository.save(
    mockTest,
  );

  await this.cacheManager.del(
    `mock-test-questions:${mockTest.id}`,
  );

  return {
    id: saved.id,
    question: saved.question,
    options: saved.options,
    correctAnswer: saved.correctAnswer,
    explanation: saved.explanation,
    mockTestId: mockTest.id,
  };
}

async findByMockTest(mockTestId: string) {
  const cacheKey =
    `mock-test-questions:${mockTestId}`;

  
  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  
  const mockTest =
    await this.mockTestRepository.findOne({
      where: {
        id: mockTestId,
      },
    });

  if (!mockTest) {
    throw new NotFoundException(
      'Mock test not found',
    );
  }

  
  const questions =
    await this.questionRepository
      .createQueryBuilder('question')
      .select([
        'question.id',
        'question.question',
        'question.options',
        'question.createdAt',
      ])
      .where(
        'question.mockTestId = :mockTestId',
        { mockTestId },
      )
      .orderBy(
        'question.createdAt',
        'ASC',
      )
      .getMany();

  const response = {
    mockTestId,
    total: questions.length,
    result: questions,
  };

  
  return setCache(
    this.cacheManager,
    cacheKey,
    response,
  );
}
}
