import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { GraduationSemesterService } from './graduation-semester.service';

import { CreateGraduationSemesterDto } from './dto/create-graduation-semester.dto';
import { ParseUUIDPipe} from '@nestjs/common';

@Controller('graduation-semesters')
export class GraduationSemesterController {
  constructor(
    private readonly graduationSemesterService: GraduationSemesterService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateGraduationSemesterDto,
  ) {
    return this.graduationSemesterService.create(
      dto,
    );
  }

@Get()
findAll(
  @Query(
    'degreeUniversityId',
    new ParseUUIDPipe({ optional: true }),
  )
  degreeUniversityId?: string,
) {
  return this.graduationSemesterService.findAll(
    degreeUniversityId,
  );
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.graduationSemesterService.findOne(
      id,
    );
  }
}
