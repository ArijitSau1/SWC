import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodeMailerService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendOtpMail(
    email: string,
    otp: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      from: 'arijitsau45@gmail.com',
      subject: 'SWC - Password Reset OTP',

      text: `Your password reset OTP is ${otp}. This OTP is valid for 5 minutes.`,

      html: `
        <div>
          <h2>SWC Password Reset</h2>

          <p>Your password reset verification code is:</p>

          <h1>${otp}</h1>

          <p>
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            please ignore this email.
          </p>
        </div>
      `,
    });
  }
}