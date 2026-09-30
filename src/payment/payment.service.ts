import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Razorpay from 'razorpay';
import * as crypto from 'crypto';

import { Course } from 'src/course/entities/course.entity';
import {
  Payment,
  PaymentStatus,
} from './entities/payment.entity';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(
    courseId: string,
    accountId: string,
  ) {
    const course =
      await this.courseRepository.findOne({
        where: {
          id: courseId,
        },
      });

    if (!course) {
      throw new NotFoundException(
        'Course not found',
      );
    }

    if (course.isFree) {
      throw new BadRequestException(
        'This course is free',
      );
    }

    const amount = Number(course.price);

    if (amount <= 0) {
      throw new BadRequestException(
        'Invalid course price',
      );
    }

    const razorpayOrder =
      await this.razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `course_${course.id}_${Date.now()}`,
      });

    const payment =
      this.paymentRepository.create({
        account: {
          id: accountId,
        },
        course: {
          id: course.id,
        },
        razorpayOrderId:
          razorpayOrder.id,
        amount,
        discount: 0,
        status: PaymentStatus.CREATED,
      });

    await this.paymentRepository.save(
      payment,
    );

    return {
      paymentId: payment.id,

      orderId: razorpayOrder.id,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      keyId: process.env.RAZORPAY_KEY_ID,
    };
  }
}
