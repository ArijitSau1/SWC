import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademicStreamController } from './academic-stream.controller';
import { AcademicStreamService } from './academic-stream.service';
import { AcademicStream } from './entities/academic-stream.entity';
import { AcademicClass } from 'src/academic-class/entities/academic-class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicStream,
      AcademicClass,
    ]),
  ],
  controllers: [AcademicStreamController],
  providers: [AcademicStreamService],
})
export class AcademicStreamModule {}
