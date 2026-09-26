import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './entities/course.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

import { Subject } from 'src/subject/entities/subject.entity';
import { AcademicClass } from 'src/academic-class/entities/academic-class.entity';
import { AcademicSemester } from 'src/academic-semester/entities/academic-semester.entity';
import { GraduationSemester } from 'src/graduation-semester/entities/graduation-semester.entity';
import { CourseContent } from 'src/course-content/entities/course-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Subject,
      AcademicClass,
      AcademicSemester,
      GraduationSemester,
      CourseContent
    ]),
  ],

  controllers: [CourseController],

  providers: [CourseService],

  exports: [CourseService],
})
export class CourseModule {}
