import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { GraduationDegreeService } from './graduation-degree.service';
import { CreateGraduationDegreeDto } from './dto/create-graduation-degree.dto';
import { Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@Controller('graduation-degrees')
export class GraduationDegreeController {
  constructor(
    private readonly graduationDegreeService: GraduationDegreeService,
  ) {}

  @Post()
  create(@Body() dto: CreateGraduationDegreeDto) {
    return this.graduationDegreeService.create(dto);
  }

@Get()
findAll(
  @Query() dto: PaginationDto,
) {
  return this.graduationDegreeService.findAll(dto);
}

  @Get(':id')
findOne(
  @Param('id', new ParseUUIDPipe())
  id: string,
) {
  return this.graduationDegreeService.findOne(id);
}
}