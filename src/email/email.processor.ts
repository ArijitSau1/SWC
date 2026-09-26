import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';

import { EmailJobData } from './email.types';

@Processor('email', {
  concurrency: 5,
})
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
  ) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<void> {
    console.log(`Processing email job: ${job.id}`);

    await this.mailerService.sendMail({
      to: job.data.to,
      from: process.env.ADMIN_MAIL!,
      subject: job.data.subject,
      text: job.data.text,
      html: job.data.html,
    });

    console.log(`Email sent successfully: ${job.data.to}`);
  }
}