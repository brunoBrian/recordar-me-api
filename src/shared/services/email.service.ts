import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPaymentConfirmation(email: string, amount: number): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Payment Confirmation',
      html: `
        <h1>Payment Confirmed!</h1>
        <p>Your payment of R$ ${amount.toFixed(2)} has been confirmed.</p>
        <p>Thank you for your purchase!</p>
      `,
    });
  }
}