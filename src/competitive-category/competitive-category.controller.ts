import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CompetitiveCategoryService } from './competitive-category.service';

import { CreateCompetitiveCategoryDto } from './dto/create-competitive-category.dto';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('competitive-categories')
export class CompetitiveCategoryController {
  constructor(
    private readonly categoryService:
      CompetitiveCategoryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
  create(
    @Body()
    dto: CreateCompetitiveCategoryDto,
  ) {
    return this.categoryService.create(dto);
  }

  @Get()
  findAll(
    @Query() dto: PaginationDto,
  ) {
    return this.categoryService.findAll(dto);
  }
}
