import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AcademicClassService } from './academic-class.service';
import { CreateAcademicClassDto } from './dto/create-academic-class.dto';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum/user-role.enum';


@Controller('academic-classes')
export class AcademicClassController {
  constructor(
    private readonly academicClassService: AcademicClassService,
  ) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateAcademicClassDto) {
    return this.academicClassService.create(dto);
  }

@Get()
findAll(
  @Query() dto: PaginationDto,

  @Query(
    'academicProgramId',
    new ParseUUIDPipe({ optional: true }),
  )
  academicProgramId?: string,
) {
  return this.academicClassService.findAll(
    dto,
    academicProgramId,
  );
}

  @Get(':id')
  findOne(@Param('id',new ParseUUIDPipe()) id: string) {
    return this.academicClassService.findOne(id);
  }
}
