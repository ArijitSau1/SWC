import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { MockTestAttemptService } from './mock-test-attempt.service';
import { SubmitMockTestDto } from './dto/submit-mock-test.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('mock-test-attempts')
export class MockTestAttemptController {
  constructor(
    private readonly mockTestAttemptService: MockTestAttemptService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  submit(@Req() req: any, @Body() dto: SubmitMockTestDto) {
    return this.mockTestAttemptService.submit(req.user.id, dto);
  }

    @Get('my-results')
  @UseGuards(JwtAuthGuard)
  findMyResults(@CurrentUser() user: Account) {
    return this.mockTestAttemptService.findMyResults(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: Account) {
    return this.mockTestAttemptService.findOne(id, user.id);
  }



  @Get(':id/review')
@UseGuards(JwtAuthGuard)
review(
  @Param('id') id: string,
  @CurrentUser() user: Account,
) {
  return this.mockTestAttemptService.review(
    id,
    user.id,
  );
}
}
