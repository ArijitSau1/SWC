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
import { EmailModule } from '../email/email.module';
import { StringValue } from 'ms';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([Account, PasswordReset,UserPermission]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),

        signOptions: {
          expiresIn: configService.getOrThrow<StringValue>(
            'JWT_ACCESS_EXPIRES_IN',
          ),
        },
      }),
    }),
    NodeMailerModule,
    EmailModule,
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],

  exports: [AuthService],
})
export class AuthModule {}
