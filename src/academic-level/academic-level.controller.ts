import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { AcademicLevelService } from './academic-level.service';
import { CreateAcademicLevelDto } from './dto/create-academic-level.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('academic-levels')
export class AcademicLevelController {
  constructor(
    private readonly academicLevelService: AcademicLevelService,
  ) {}

  @Post()
  create(@Body() dto: CreateAcademicLevelDto) {
    return this.academicLevelService.create(dto);
  }

@Get()
findAll(
  @Query() dto: PaginationDto,
) {
  return this.academicLevelService.findAll(dto);
}

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.academicLevelService.findOne(id);
  }
}
