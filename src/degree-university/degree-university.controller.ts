import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { DegreeUniversityService } from './degree-university.service';

import { CreateDegreeUniversityDto } from './dto/create-degree-university.dto';

@Controller('degree-universities')
export class DegreeUniversityController {
  constructor(
    private readonly degreeUniversityService: DegreeUniversityService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateDegreeUniversityDto,
  ) {
    return this.degreeUniversityService.create(dto);
  }

@Get()
findAll(
  @Query('degreeId',new ParseUUIDPipe({ optional: true }),)
  degreeId?: string,
) {
  return this.degreeUniversityService.findAll(
    degreeId,
  );
}

@Get(':id')
findOne(
  @Param('id', new ParseUUIDPipe())
  id: string,
) {
  return this.degreeUniversityService.findOne(id);
}
}
