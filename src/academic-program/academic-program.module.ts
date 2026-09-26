import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademicProgramController } from './academic-program.controller';
import { AcademicProgramService } from './academic-program.service';

import { AcademicProgram } from './entities/academic-program.entity';
import { AcademicLevel } from 'src/academic-level/entities/academic-level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicProgram,
      AcademicLevel,
    ]),
  ],

  controllers: [
    AcademicProgramController,
  ],

  providers: [
    AcademicProgramService,
  ],
})
export class AcademicProgramModule {}