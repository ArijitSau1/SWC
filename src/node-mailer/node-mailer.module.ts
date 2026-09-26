import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NodeMailerController } from './node-mailer.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,

          auth: {
            user: configService.get<string>('ADMIN_MAIL'),
            pass: configService.get<string>('GMAIL_PASS'),
          },
        },
      }),
    }),
  ],

  controllers: [NodeMailerController],

  exports: [MailerModule],
})
export class NodeMailerModule {}
