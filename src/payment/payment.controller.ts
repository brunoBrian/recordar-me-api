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
        if (paymentDetails?.status === "pending") {
          const amount = paymentDetails?.transaction_amount;

          if (!email || !uuid) {
            console.error(
              "Missing email or external_reference in payment details"
            );
            return res.status(400).send("Invalid payment details");
          }

          // Link da história personalizada
          const link = `https://lovezin-three.vercel.app/nossa-historia/${uuid}`;

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
}
