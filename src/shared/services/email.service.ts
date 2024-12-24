import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "recordar.me.oficial@gmail.com",
        pass: "Cabelera@10",
      },
    });
  }

  async sendPaymentConfirmation(
    email: string,
    amount: number,
    link: string
  ): Promise<void> {
    console.log(`Sending payment confirmation to ${email}`);
    console.log(`Amount: R$${amount.toFixed(2)}`);

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Payment Confirmation",
      html: `
        <h1>Payment Confirmed!</h1>
        <p>Your payment of R$ ${amount.toFixed(2)} has been confirmed.</p>
        <p>Thank you for your purchase!</p>

        <a href="${link}">View your purchase</a>
      `,
    });
  }
}
