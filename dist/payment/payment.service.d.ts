import { EmailService } from '../shared/services/email.service';
import { CreatePixPaymentDto } from './dto/create-pix-payment.dto';
export declare class PaymentService {
    private readonly emailService;
    constructor(emailService: EmailService);
    createPixPayment(createPixPaymentDto: CreatePixPaymentDto): Promise<{
        qrCode: string;
    }>;
    private generatePixData;
}
