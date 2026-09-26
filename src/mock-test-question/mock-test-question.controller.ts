import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { MockTestQuestionService } from './mock-test-question.service';
import { CreateMockTestQuestionDto } from './dto/create-mock-test-question.dto';


import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('mock-test-questions')
export class MockTestQuestionController {
  constructor(
    private readonly mockTestQuestionService: MockTestQuestionService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() dto: CreateMockTestQuestionDto,
  ) {
    return this.mockTestQuestionService.create(
      dto,
    );
  }


  @Get('mock-test/:mockTestId')
findByMockTest(
  @Param('mockTestId') mockTestId: string,
) {
  return this.mockTestQuestionService.findByMockTest(
    mockTestId,
  );
}
}