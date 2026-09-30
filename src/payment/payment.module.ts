import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

import { Payment } from './entities/payment.entity';
import { Course } from 'src/course/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Course,
    ]),
  ],

  controllers: [PaymentController],

  providers: [PaymentService],
})
export class PaymentModule {}
