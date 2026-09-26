import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademicClassController } from './academic-class.controller';
import { AcademicClassService } from './academic-class.service';

import { AcademicClass } from './entities/academic-class.entity';
import { AcademicProgram } from 'src/academic-program/entities/academic-program.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicClass,
      AcademicProgram,
    ]),
  ],

  controllers: [
    AcademicClassController,
  ],

  providers: [
    AcademicClassService,
  ],
})
export class AcademicClassModule {}