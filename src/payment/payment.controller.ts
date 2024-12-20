import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePixPaymentDto } from './dto/create-pix-payment.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('pagamento')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pix')
  @ApiOperation({ summary: 'Generate PIX payment QR Code' })
  async createPixPayment(@Body() createPixPaymentDto: CreatePixPaymentDto) {
    return this.paymentService.createPixPayment(createPixPaymentDto);
  }
}