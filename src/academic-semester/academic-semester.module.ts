import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademicSemesterController } from './academic-semester.controller';
import { AcademicSemesterService } from './academic-semester.service';
import { AcademicSemester } from './entities/academic-semester.entity';
import { AcademicStream } from 'src/academic-stream/entities/academic-stream.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicSemester,
      AcademicStream,
    ]),
  ],
  controllers: [AcademicSemesterController],
  providers: [AcademicSemesterService],
})
export class AcademicSemesterModule {}
