import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CompetitiveSubjectService } from './competitive-subject.service';

import { CreateCompetitiveSubjectDto } from './dto/create-competitive-subject.dto';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('competitive-subjects')
export class CompetitiveSubjectController {
  constructor(
    private readonly subjectService:
      CompetitiveSubjectService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
  create(
    @Body()
    dto: CreateCompetitiveSubjectDto,
  ) {
    return this.subjectService.create(dto);
  }

  @Get('exam/:examId')
  findByExam(
    @Param('examId') examId: string,
    @Query() dto: PaginationDto,
  ) {
    return this.subjectService.findByExam(
      examId,
      dto,
    );
  }
}
