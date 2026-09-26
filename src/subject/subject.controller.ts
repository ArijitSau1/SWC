import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { SubjectService } from './subject.service';

import { CreateSubjectDto } from './dto/create-subject.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum/user-role.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('subjects')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
  ) {}

  
  @Get()
findAll(@Query() dto: PaginationDto) {
  return this.subjectService.findAll(dto);
}

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(id);
  }

  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectService.create(dto);
  }

}
