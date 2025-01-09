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

    console.log(`qrcode created to: ${createPixPaymentDto.email}`);
    console.log(
      `payment id: ${payment.id}, payment data: ${payment.point_of_interaction}`
    );

    return {
      payment_id: payment.id,
      qrCode,
      pixKey: payment.point_of_interaction.transaction_data.qr_code,
      pixKeyBase64:
        payment.point_of_interaction.transaction_data.qr_code_base64,
      ticket_url: payment.point_of_interaction.transaction_data.ticket_url,
    };
  }

  private async createMercadoPagoPixPayment(
    createPixBody: CreatePixPaymentDto
  ) {
    const isProduction = process.env.NODE_ENV === "production";

    const client = new MercadoPagoConfig({
      accessToken: isProduction
        ? process.env.MERCADO_PAGO_ACCESS_TOKEN_PROD
        : process.env.MERCADO_PAGO_ACCESS_TOKEN_TEST,
    });

    console.log("createPixBody", createPixBody);

    const payment = new Payment(client);

    console.log(`creating qrcode to: ${createPixBody?.email}`);

    try {
      const response = await payment.create({
        body: {
          transaction_amount: 0.01,
          // transaction_amount: data.amount,
          description: createPixBody.description,
          payment_method_id: "pix",
          external_reference: `${createPixBody.uuid}|${createPixBody.email}|${createPixBody.phone}`,
          payer: {
            email: createPixBody.email,
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
    const isProduction = process.env.NODE_ENV === "production";

    const client = new MercadoPagoConfig({
      accessToken: isProduction
        ? process.env.MERCADO_PAGO_ACCESS_TOKEN_PROD
        : process.env.MERCADO_PAGO_ACCESS_TOKEN_TEST,
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
