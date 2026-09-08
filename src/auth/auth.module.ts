import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Account } from '../account/entities/account.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PasswordReset } from './entities/password-reset.entity';
import { NodeMailerModule } from '../node-mailer/node-mailer.module';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([Account,PasswordReset]),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

       useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
      }),
       NodeMailerModule,
  ],

  controllers: [AuthController],

  providers: [AuthService,JwtStrategy],

  exports: [AuthService],
})
export class AuthModule {}
