import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GraduationSemesterController } from './graduation-semester.controller';
import { GraduationSemesterService } from './graduation-semester.service';

import { GraduationSemester } from './entities/graduation-semester.entity';
import { DegreeUniversity } from 'src/degree-university/entities/degree-university.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GraduationSemester,
      DegreeUniversity,
    ]),
  ],

  controllers: [
    GraduationSemesterController,
  ],

  providers: [
    GraduationSemesterService,
  ],
})
export class GraduationSemesterModule {}
