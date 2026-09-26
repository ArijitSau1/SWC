import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum/user-role.enum';
import { CourseFilterDto } from './dto/course-filter.dto';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  findAll(@Query() dto: CourseFilterDto) {
    return this.courseService.findAll(dto);
  }

  @Get(':id')
findOne(@Param('id') id: string) {
  return this.courseService.findOne(id);
}
}
