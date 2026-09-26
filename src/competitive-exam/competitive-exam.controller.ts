import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CompetitiveExamService } from './competitive-exam.service';

import { CreateCompetitiveExamDto } from './dto/create-competitive-exam.dto';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum/user-role.enum';

@Controller('competitive-exams')
export class CompetitiveExamController {
  constructor(private readonly examService: CompetitiveExamService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    dto: CreateCompetitiveExamDto,
  ) {
    return this.examService.create(dto);
  }

  @Get()
  findAll(@Query() dto: PaginationDto) {
    return this.examService.findAll(dto);
  }

  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() dto: PaginationDto,
  ) {
    return this.examService.findByCategory(categoryId, dto);
  }
}
