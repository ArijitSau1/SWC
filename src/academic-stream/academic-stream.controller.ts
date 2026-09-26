import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { AcademicStreamService } from './academic-stream.service';
import { CreateAcademicStreamDto } from './dto/create-academic-stream.dto';

@Controller('academic-streams')
export class AcademicStreamController {
  constructor(
    private readonly academicStreamService: AcademicStreamService,
  ) {}

  @Post()
  create(@Body() dto: CreateAcademicStreamDto) {
    return this.academicStreamService.create(dto);
  }

  @Get()
  findAll(
    @Query('academicClassId', new ParseUUIDPipe({optional:true}))
    academicClassId?: string,
  ) {
    return this.academicStreamService.findAll(
      academicClassId,
    );
  }

@Get(':id')
findOne(
  @Param('id', new ParseUUIDPipe())
  id: string,
) {
  return this.academicStreamService.findOne(id);
}
}
