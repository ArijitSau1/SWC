import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';

import { Account } from 'src/account/entities/account.entity';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { PasswordReset } from './entities/password-reset.entity';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    private readonly nodeMailerService:NodeMailerService,

    @InjectRepository(Account)
    private readonly repo: Repository<Account>,

    @InjectRepository(PasswordReset)
    private readonly passwordResetRepo: Repository<PasswordReset>,

  ) {}

  async signIn(email: string, password: string) {
    const user = await this.getUserDetails(email);

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = await APIFeatures.assignJwtToken(user.id, this.jwtService);

    return {
      token,
    };
  }

  validate(id: string) {
    return this.getUserDetails(id);
  }

  private readonly getUserDetails = async (id: string): Promise<Account> => {
    const query = this.repo
      .createQueryBuilder('account')
      .addSelect('account.password');

    const result = await query
      .andWhere('account.id = :id OR account.email = :email', {
        id,
        email: id,
      })
      .getOne();

    if (!result) {
      throw new UnauthorizedException('Account not found!');
    }

    return result;
  };


  async forgotPassword(email: string) {
  const user = await this.repo.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new UnauthorizedException(
      'Invalid email address',
    );
  }

  const otp = this.generateOtp();

  const expiresAt = new Date(
    Date.now() + 5 * 60 * 1000,
  );

  await this.passwordResetRepo.save({
    email,
    otp,
    expiresAt,
    verified: false,
  });

  await this.nodeMailerService.sendOtpMail(
    email,
    otp,
  );

  return {
    message: 'Verification code sent successfully',
  };
}

private generateOtp(): string {
  return Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
}



async verifyCode(
  email: string,
  otp: string,
) {
  const resetRequest =
    await this.passwordResetRepo.findOne({
      where: {
        email,
        otp,
      },
      order: {
        createdAt: 'DESC',
      },
    });

  if (!resetRequest) {
    throw new UnauthorizedException(
      'Invalid verification code',
    );
  }

  if (resetRequest.verified) {
    throw new UnauthorizedException(
      'Verification code already used',
    );
  }

  if (
    new Date() > resetRequest.expiresAt
  ) {
    throw new UnauthorizedException(
      'Verification code has expired',
    );
  }

  resetRequest.verified = true;

  await this.passwordResetRepo.save(
    resetRequest,
  );

  return {
    message: 'Verification successful',
  };
}


async resetPassword(email: string, newPassword: string) {
  // 1. Check OTP was verified
  const resetRequest = await this.passwordResetRepo.findOne({
    where: {
      email,
      verified: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });

  if (!resetRequest) {
    throw new UnauthorizedException(
      'Please verify the OTP first',
    );
  }

  
  const user = await this.repo
    .createQueryBuilder('account')
    .addSelect('account.password')
    .where('account.email = :email', { email })
    .getOne();

  if (!user) {
    throw new UnauthorizedException('Account not found');
  }

  
  const isSamePassword = await bcrypt.compare(
    newPassword,
    user.password,
  );

  if (isSamePassword) {
    throw new BadRequestException(
      'New password cannot be the same as the old password',
    );
  }

  
  const hashedPassword = await bcrypt.hash(newPassword, 13);

  
  user.password = hashedPassword;

  await this.repo.save(user);

  
  await this.passwordResetRepo.delete(resetRequest.id);

  return {
    message: 'Password reset successfully',
  };
}
}
