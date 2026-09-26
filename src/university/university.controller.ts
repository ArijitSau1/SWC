import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';

@Controller('universities')
export class UniversityController {
  constructor(
    private readonly universityService: UniversityService,
  ) {}

  @Post()
  create(@Body() dto: CreateUniversityDto) {
    return this.universityService.create(dto);
  }

  @Get()
  findAll() {
    return this.universityService.findAll();
  }

  @Get(':id')
findOne(
  @Param('id', new ParseUUIDPipe())
  id: string,
) {
  return this.universityService.findOne(id);
}
}
