import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt.guards';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.signIn(
      dto.email,
      dto.password,
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
profile(@CurrentUser() user: Account) {
  return {
    name: user.name,
    email: user.email,
  };
}

@Post('forgot-password')
async forgotPassword(
  @Body() dto: ForgotPasswordDto,
) {
  return this.authService.forgotPassword(
    dto.email,
  );
}

@Post('verify-code')
async verifyCode(
  @Body() dto: VerifyOtpDto,
) {
  return this.authService.verifyCode(
    dto.email,
    dto.otp,
  );
}


@Post('reset-password')
async resetPassword(
  @Body() dto: ResetPasswordDto,
) {
  return this.authService.resetPassword(
    dto.email,
    dto.password,
  );
}
}
