import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { MockTestService } from './mock-test.service';
import { CreateMockTestDto } from './dto/create-mock-test.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum/user-role.enum';

@Controller('mock-tests')
export class MockTestController {
  constructor(
    private readonly mockTestService:
      MockTestService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateMockTestDto) {
    return this.mockTestService.create(dto);
  }

  @Get('course-content/:courseContentId')
findByCourseContent(
  @Param('courseContentId') courseContentId: string,
) {
  return this.mockTestService.findByCourseContent(
    courseContentId,
  );
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.mockTestService.findOne(id);
}
}
