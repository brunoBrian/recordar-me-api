import { Injectable } from "@nestjs/common";
import * as QRCode from "qrcode";
import { Payment, MercadoPagoConfig } from "mercadopago";
import { EmailService } from "../shared/services/email.service";
import { CreatePixPaymentDto } from "./dto/create-pix-payment.dto";

@Injectable()
export class PaymentService {
  constructor(private readonly emailService: EmailService) {}

  async createPixPayment(createPixPaymentDto: CreatePixPaymentDto) {
    const payment = await this.createMercadoPagoPixPayment(createPixPaymentDto);

    const qrCode = await QRCode.toDataURL(
      payment.point_of_interaction.transaction_data.qr_code
    );

    return {
      qrCode,
      pixKey: payment.point_of_interaction.transaction_data.qr_code,
      pixKeyBase64:
        payment.point_of_interaction.transaction_data.qr_code_base64,
      ticket_url: payment.point_of_interaction.transaction_data.ticket_url,
    };
  }

  private async createMercadoPagoPixPayment(data: CreatePixPaymentDto) {
    const client = new MercadoPagoConfig({
      accessToken:
        "TEST-4040709112330075-122015-a86226fe016fc8bcc2317edd45d21a1b-223439510",
    });
    const payment = new Payment(client);

    try {
      const response = await payment.create({
        body: {
          transaction_amount: data.amount,
          description: data.description,
          payment_method_id: "pix",
          payer: {
            email: data.email,
          },
        },
      });

      return response;
    } catch (error) {
      throw new Error(
        `Error creating Mercado Pago Pix payment: ${error.message}`
      );
    }
  }

  async getPaymentDetails(paymentId: string) {
    const mercadopago = require("mercadopago");
    mercadopago.configure({
      accessToken:
        "TEST-4040709112330075-122015-a86226fe016fc8bcc2317edd45d21a1b-223439510",
    });

    try {
      const response = await mercadopago.payment.get(paymentId);
      return response.body;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw new Error("Error fetching payment details");
    }
  }
}
