import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { CompetitiveSubject } from './entities/competitive-subject.entity';

import { CompetitiveExam } from 'src/competitive-exam/entities/competitive-exam.entity';

import { CompetitiveSubjectController } from './competitive-subject.controller';

import { CompetitiveSubjectService } from './competitive-subject.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompetitiveSubject,
      CompetitiveExam,
    ]),
  ],

  controllers: [
    CompetitiveSubjectController,
  ],

  providers: [
    CompetitiveSubjectService,
  ],

  exports: [
    CompetitiveSubjectService,
  ],
})
export class CompetitiveSubjectModule {}
