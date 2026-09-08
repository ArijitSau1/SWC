import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { NodeMailerController } from './node-mailer.controller';
import { NodeMailerService } from './node-mailer.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587, // Port for secure SMTP
        // secure: true,
        tls: { rejectUnauthorized: true },
        auth: {
          user: process.env.ADMIN_MAIL, //admin gmail id
          pass: process.env.GMAIL_PASS,
        },
      },
    })
  ],
  controllers: [NodeMailerController],
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
export class NodeMailerModule {}
