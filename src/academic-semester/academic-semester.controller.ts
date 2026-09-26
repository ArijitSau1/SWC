import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { AcademicSemesterService } from './academic-semester.service';
import { CreateAcademicSemesterDto } from './dto/create-academic-semester.dto';

@Controller('academic-semesters')
export class AcademicSemesterController {
  constructor(
    private readonly academicSemesterService: AcademicSemesterService,
  ) {}

  @Post()
  create(@Body() dto: CreateAcademicSemesterDto) {
    return this.academicSemesterService.create(dto);
  }


  @Get()
findAll(
  @Query(
    'academicStreamId',
    new ParseUUIDPipe({ optional: true }),
  )
  academicStreamId?: string,
) {
  return this.academicSemesterService.findAll(
    academicStreamId,
  );
}

  @Get(':id')
  findOne(@Param('id',new ParseUUIDPipe()) id: string) {
    return this.academicSemesterService.findOne(id);
  }
}