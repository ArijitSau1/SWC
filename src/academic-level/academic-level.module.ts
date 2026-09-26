import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademicLevelController } from './academic-level.controller';
import { AcademicLevelService } from './academic-level.service';
import { AcademicLevel } from './entities/academic-level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicLevel,
    ]),
  ],

  controllers: [
    AcademicLevelController,
  ],

  providers: [
    AcademicLevelService,
  ],

  exports: [
    AcademicLevelService,
  ],
})
export class AcademicLevelModule {}
