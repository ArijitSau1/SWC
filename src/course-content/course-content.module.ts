import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseContent } from './entities/course-content.entity';
import { Course } from 'src/course/entities/course.entity';

import { CourseContentController } from './course-content.controller';
import { CourseContentService } from './course-content.service';

import { BunnyModule } from 'src/bunny/bunny.module';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseContent, Course, MockTest]),
    BunnyModule,
  ],

  controllers: [CourseContentController],

  providers: [CourseContentService],

  exports: [CourseContentService],
})
export class CourseContentModule {}
