import {
    ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockTestAttempt } from './entities/mock-test-attempt.entity';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { MockTestQuestion } from 'src/mock-test-question/entities/mock-test-question.entity';

import { SubmitMockTestDto } from './dto/submit-mock-test.dto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { setCache } from 'src/utils/cache.utils';

@Injectable()
export class MockTestAttemptService {
  constructor(
    @InjectRepository(MockTestAttempt)
    private readonly attemptRepository: Repository<MockTestAttempt>,

    @InjectRepository(MockTest)
    private readonly mockTestRepository: Repository<MockTest>,

    @InjectRepository(MockTestQuestion)
    private readonly questionRepository: Repository<MockTestQuestion>,

    @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache,
  ) {}

  async submit(
    accountId: string,
    dto: SubmitMockTestDto,
  ) {
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

    const existingAttempt =
  await this.attemptRepository
    .createQueryBuilder('attempt')
    .leftJoin('attempt.mockTest', 'mockTest')
    .leftJoin('attempt.account', 'account')
    .where('mockTest.id = :mockTestId', {
      mockTestId: dto.mockTestId,
    })
    .andWhere('account.id = :accountId', {
      accountId,
    })
    .getOne();

if (existingAttempt) {
  throw new ConflictException(
    'You have already submitted this mock test',
  );
}

    const questions =
      await this.questionRepository.find({
        where: {
          mockTest: {
            id: dto.mockTestId,
          },
        },
      });

    let correctAnswers = 0;

    for (const question of questions) {
      const selectedAnswer =
        dto.answers[question.id];

      if (
        selectedAnswer !== undefined &&
        selectedAnswer === question.correctAnswer
      ) {
        correctAnswers++;
      }
    }

    const totalMarks =
      questions.length *
      mockTest.marksPerQuestion;

    const score =
      correctAnswers *
      mockTest.marksPerQuestion;

    const wrongAnswers =
      questions.length - correctAnswers;

    const attempt =
      this.attemptRepository.create({
        mockTest,
        account: {
          id: accountId,
        },
        answers: dto.answers,
        score,
        totalMarks,
        correctAnswers,
        wrongAnswers,
      });

    const saved =
      await this.attemptRepository.save(
        attempt,
      );

      await this.cacheManager.del(
  `mock-test-results:${accountId}`,
);

    return {
      id: saved.id,
      mockTestId: mockTest.id,
      score,
      totalMarks,
      correctAnswers,
      wrongAnswers,
    };
  }

  async findMyResults(accountId: string) {
  const cacheKey =
    `mock-test-results:${accountId}`;

  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const results =
    await this.attemptRepository
      .createQueryBuilder('attempt')
      .leftJoinAndSelect(
        'attempt.mockTest',
        'mockTest',
      )
      .select([
        'attempt.id',
        'attempt.score',
        'attempt.totalMarks',
        'attempt.correctAnswers',
        'attempt.wrongAnswers',
        'attempt.submittedAt',

        'mockTest.id',
        'mockTest.title',
      ])
      .where(
        'attempt.accountId = :accountId',
        { accountId },
      )
      .orderBy(
        'attempt.submittedAt',
        'DESC',
      )
      .getMany();

  const response = {
    total: results.length,
    result: results,
  };

  return setCache(
    this.cacheManager,
    cacheKey,
    response,
  );
}


async findOne(id: string, accountId: string) {
  const cacheKey =
    `mock-test-result:${accountId}:${id}`;

  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const attempt =
    await this.attemptRepository
      .createQueryBuilder('attempt')
      .leftJoinAndSelect(
        'attempt.mockTest',
        'mockTest',
      )
      .where('attempt.id = :id', { id })
      .andWhere(
        'attempt.accountId = :accountId',
        { accountId },
      )
      .select([
        'attempt.id',
        'attempt.score',
        'attempt.totalMarks',
        'attempt.correctAnswers',
        'attempt.wrongAnswers',
        'attempt.submittedAt',

        'mockTest.id',
        'mockTest.title',
      ])
      .getOne();

  if (!attempt) {
    throw new NotFoundException(
      'Result not found',
    );
  }

  return setCache(
    this.cacheManager,
    cacheKey,
    attempt,
  );
}

async review(id: string, accountId: string) {
  const cacheKey =
    `mock-test-review:${accountId}:${id}`;

  const cachedData =
    await this.cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const attempt =
    await this.attemptRepository
      .createQueryBuilder('attempt')
      .leftJoinAndSelect(
        'attempt.mockTest',
        'mockTest',
      )
      .where('attempt.id = :id', { id })
      .andWhere(
        'attempt.accountId = :accountId',
        { accountId },
      )
      .getOne();

  if (!attempt) {
    throw new NotFoundException(
      'Result not found',
    );
  }

  const questions =
    await this.questionRepository
      .createQueryBuilder('question')
      .where(
        'question.mockTestId = :mockTestId',
        {
          mockTestId: attempt.mockTest.id,
        },
      )
      .orderBy(
        'question.createdAt',
        'ASC',
      )
      .getMany();

  const result = questions.map((question) => {
    const selectedAnswer =
      attempt.answers?.[question.id];

    return {
      id: question.id,
      question: question.question,
      options: question.options,
      selectedAnswer:
        selectedAnswer ?? null,
      correctAnswer:
        question.correctAnswer,
      isCorrect:
        selectedAnswer !== undefined &&
        selectedAnswer ===
          question.correctAnswer,
      explanation:
        question.explanation,
    };
  });

  const response = {
    summary: {
      totalQuestions: questions.length,
      correctAnswers:
        attempt.correctAnswers,
      wrongAnswers:
        attempt.wrongAnswers,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage:
        attempt.totalMarks > 0
          ? Number(
              (
                (attempt.score /
                  attempt.totalMarks) *
                100
              ).toFixed(2),
            )
          : 0,
    },

    questions: result,
  };

  return setCache(
    this.cacheManager,
    cacheKey,
    response,
  );
}
}