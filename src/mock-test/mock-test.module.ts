import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MockTest } from './entities/mock-test.entity';
import { CourseContent } from 'src/course-content/entities/course-content.entity';

import { MockTestController } from './mock-test.controller';
import { MockTestService } from './mock-test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MockTest,
      CourseContent,
    ]),
  ],
  controllers: [MockTestController],
  providers: [MockTestService],
  exports: [MockTestService],
})
export class MockTestModule {}
