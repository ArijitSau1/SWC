import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';

import { NodeMailerModule } from '../node-mailer/node-mailer.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',

      defaultJobOptions: {
        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 1000,
        },

        removeOnComplete: 100,
        removeOnFail: 50,
      },
    }),

    NodeMailerModule,
  ],

  providers: [
    EmailService,
    EmailProcessor,
  ],

  exports: [
    EmailService,
  ],
})
export class EmailModule {}