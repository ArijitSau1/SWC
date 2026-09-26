import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { CompetitiveCategory } from './entities/competitive-category.entity';

import { CompetitiveCategoryController } from './competitive-category.controller';

import { CompetitiveCategoryService } from './competitive-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompetitiveCategory,
    ]),
  ],

  controllers: [
    CompetitiveCategoryController,
  ],

  providers: [
    CompetitiveCategoryService,
  ],

  exports: [
    CompetitiveCategoryService,
  ],
})
export class CompetitiveCategoryModule {}
