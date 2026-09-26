import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { EmailJobData } from './email.types';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  async sendOtpEmail(
    email: string,
    otp: string,
  ): Promise<void> {
    await this.emailQueue.add('send-otp', {
      to: email,
      subject: 'SWC - Password Reset OTP',
      text: `Your password reset OTP is ${otp}. This OTP is valid for 5 minutes.`,
      html: this.getOtpTemplate(otp),
    });
  }

  private getOtpTemplate(otp: string): string {
    return `
      <div>
        <h2>SWC Password Reset</h2>

        <p>Your password reset verification code is:</p>

        <h1>${otp}</h1>

        <p>
          This OTP is valid for
          <strong>5 minutes</strong>.
        </p>

      </div>
    `;
  }
}