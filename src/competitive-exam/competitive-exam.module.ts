import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { CompetitiveExam } from './entities/competitive-exam.entity';

import { CompetitiveCategory } from 'src/competitive-category/entities/competitive-category.entity';

import { CompetitiveExamController } from './competitive-exam.controller';

import { CompetitiveExamService } from './competitive-exam.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompetitiveExam,
      CompetitiveCategory,
    ]),
  ],

  controllers: [
    CompetitiveExamController,
  ],

  providers: [
    CompetitiveExamService,
  ],

  exports: [
    CompetitiveExamService,
  ],
})
export class CompetitiveExamModule {}
