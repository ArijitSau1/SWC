import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AccountService } from './account.service';
import { CreateAccountDto, PaginationDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) {}

  @Post('register')
  register(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.register(createAccountDto);
  }

   @Get()
  find(@Query() dto: PaginationDto) {
    return this.accountService.find(dto);
  }
}
