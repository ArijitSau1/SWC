import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DegreeUniversityController } from './degree-university.controller';
import { DegreeUniversityService } from './degree-university.service';

import { DegreeUniversity } from './entities/degree-university.entity';
import { GraduationDegree } from 'src/graduation-degree/entities/graduation-degree.entity';
import { University } from 'src/university/entities/university.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DegreeUniversity,
      GraduationDegree,
      University,
    ]),
  ],

  controllers: [
    DegreeUniversityController,
  ],

  providers: [
    DegreeUniversityService,
  ],
})
export class DegreeUniversityModule {}
