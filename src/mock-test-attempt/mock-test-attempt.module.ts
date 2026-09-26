import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MockTestAttempt } from './entities/mock-test-attempt.entity';
import { MockTestAttemptController } from './mock-test-attempt.controller';
import { MockTestAttemptService } from './mock-test-attempt.service';

import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { MockTestQuestion } from 'src/mock-test-question/entities/mock-test-question.entity';
import { Account } from 'src/account/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MockTestAttempt,
      MockTest,
      MockTestQuestion,
      Account,
    ]),
  ],
  controllers: [MockTestAttemptController],
  providers: [MockTestAttemptService],
})
export class MockTestAttemptModule {}
