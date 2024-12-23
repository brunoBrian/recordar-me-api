import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePixPaymentDto } from "./dto/create-pix-payment.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("payments")
@Controller("pagamento")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("pix")
  @ApiOperation({ summary: "Generate PIX payment QR Code" })
  async createPixPayment(@Body() createPixPaymentDto: CreatePixPaymentDto) {
    return this.paymentService.createPixPayment(createPixPaymentDto);
  }

  @Post("pix/webhook")
  async handleMercadoPagoNotification(@Body() body: any, @Res() res: any) {
    try {
      console.log("Webhook received:", body);

      // Check if the notification is about a payment
      if (body.type === "payment") {
        const paymentId = body.data.id;

        // Fetch payment details from Mercado Pago
        const paymentDetails =
          await this.paymentService.getPaymentDetails(paymentId);

        if (paymentDetails.status === "approved") {
          // Extract payment details
          const email = paymentDetails.payer.email;
          const amount = paymentDetails.transaction_amount;
          const uuid = paymentDetails.id;

          // Send payment confirmation email
          // await this.emailService.sendPaymentConfirmation(email, amount, uuid);

          console.log(`Payment approved and email sent to ${email}`);
        }
      }

      // Return 200 OK to Mercado Pago
      return res.status(200).send("Webhook processed successfully");
    } catch (error) {
      console.error("Error processing webhook:", error);
      throw new HttpException(
        "Error processing webhook",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
