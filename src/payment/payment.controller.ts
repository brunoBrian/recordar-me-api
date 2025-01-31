import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePixPaymentDto } from "./dto/create-pix-payment.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { EmailService } from "src/shared/services/email.service";

@ApiTags("payments")
@Controller("pagamento")
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly emailService: EmailService
  ) {}

  @Post("pix")
  @ApiOperation({ summary: "Generate PIX payment QR Code" })
  async createPixPayment(@Body() createPixPaymentDto: CreatePixPaymentDto) {
    return this.paymentService.createPixPayment(createPixPaymentDto);
  }

  @Post("pix/webhook")
  async handleMercadoPagoNotification(@Body() body: any, @Res() res: any) {
    try {
      console.log("Webhook received:", body);

      // Verifica se o tipo da notificação é 'payment'
      if (body.type === "payment" && body.data?.id) {
        const paymentId = body.data.id;

        console.log("Fetching payment details for ID:", paymentId);

        // Busca os detalhes do pagamento
        const paymentDetails =
          await this.paymentService.getPaymentDetails(paymentId);

        const [uuid, email] = paymentDetails?.external_reference.split("|");

        // Verifica o status do pagamento
        if (paymentDetails?.status === "approved") {
          const amount = paymentDetails?.transaction_amount;

          if (!email || !uuid) {
            console.error(
              "Missing email or external_reference in payment details"
            );
            return res.status(400).send("Invalid payment details");
          }

          // Link da história personalizada
          const link = `https://recordarme.com.br/nossa-historia/${uuid}`;

          // Envia o e-mail de confirmação de pagamento
          await this.emailService.sendPaymentConfirmation(email, amount, link);

          console.log(`Payment approved and email sent to ${email} - ${link}`);
        }
      }

      // Retorna 200 OK para o Mercado Pago
      return res.status(200).send("Webhook processed successfully");
    } catch (error) {
      console.error("Error processing webhook:", error);
      throw new HttpException(
        "Error processing webhook",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("check/:id")
  @ApiOperation({ summary: "Check if a QR Code payment has been made" })
  async handleCheckPayment(@Param("id") id: string, @Res() res: any) {
    console.log("Checking payment status for ID:", id);

    try {
      const paymentDetails = await this.paymentService.getPaymentDetails(id);

      if (!paymentDetails) {
        return res.status(404).send("Payment not found");
      }

      const status = paymentDetails.status;

      console.log(`Status for payment ID: ${id} is ${status}`);

      if (status === "approved") {
        return res.status(200).send({ message: "Payment approved", status });
      } else if (status === "pending") {
        return res.status(200).send({ message: "Payment pending", status });
      } else {
        return res.status(200).send({ message: "Payment status", status });
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      throw new HttpException(
        "Error checking payment status",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
