import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GraduationDegreeController } from './graduation-degree.controller';
import { GraduationDegreeService } from './graduation-degree.service';
import { GraduationDegree } from './entities/graduation-degree.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GraduationDegree,
    ]),
  ],
  controllers: [
    GraduationDegreeController,
  ],
  providers: [
    GraduationDegreeService,
  ],
})
export class GraduationDegreeModule {}
