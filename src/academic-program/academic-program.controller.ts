import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { AcademicProgramService } from './academic-program.service';
import { CreateAcademicProgramDto } from './dto/create-academic-program.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('academic-programs')
export class AcademicProgramController {
  constructor(
    private readonly academicProgramService: AcademicProgramService,
  ) {}

  @Post()
  create(@Body() dto: CreateAcademicProgramDto) {
    return this.academicProgramService.create(dto);
  }

  @Get()
  findAll(
    @Query() dto: PaginationDto,

    @Query('academicLevelId', new ParseUUIDPipe({ optional: true }))
    academicLevelId?: string,
  ) {
    return this.academicProgramService.findAll(dto, academicLevelId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.academicProgramService.findOne(id);
  }
}
