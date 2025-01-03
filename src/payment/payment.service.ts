import { Injectable } from "@nestjs/common";
import * as QRCode from "qrcode";
import { Payment, MercadoPagoConfig } from "mercadopago";
import { CreatePixPaymentDto } from "./dto/create-pix-payment.dto";

@Injectable()
export class PaymentService {
  constructor() {}

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
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });
    const payment = new Payment(client);

    try {
      const response = await payment.create({
        body: {
          transaction_amount: data.amount,
          description: data.description,
          payment_method_id: "pix",
          external_reference: `${data.uuid}|${data.email}|${data.phone}`,
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
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });
    const payment = new Payment(client);

    try {
      const response = await payment.get({ id: paymentId });
      return response;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw new Error("Error fetching payment details");
    }
  }
}
