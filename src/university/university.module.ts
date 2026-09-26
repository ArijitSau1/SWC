import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { University } from './entities/university.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      University,
    ]),
  ],
  controllers: [
    UniversityController,
  ],
  providers: [
    UniversityService,
  ],
})
export class UniversityModule {}
