import { PaymentService } from './payment.service';
import { CreatePixPaymentDto } from './dto/create-pix-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPixPayment(createPixPaymentDto: CreatePixPaymentDto): Promise<{
        qrCode: string;
    }>;
}
