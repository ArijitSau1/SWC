import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MockTestQuestion } from './entities/mock-test-question.entity';
import { MockTestQuestionController } from './mock-test-question.controller';
import { MockTestQuestionService } from './mock-test-question.service';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MockTestQuestion,
      MockTest,
    ]),
  ],
  controllers: [MockTestQuestionController],
  providers: [MockTestQuestionService],
  exports: [MockTestQuestionService],
})
export class MockTestQuestionModule {}
