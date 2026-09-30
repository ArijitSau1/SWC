import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentService } from './payment.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Body() dto: CreatePaymentOrderDto,
    @Req() req: any,
  ) {
    return this.paymentService.createOrder(
      dto.courseId,
      req.user.id,
    );
  }
}
