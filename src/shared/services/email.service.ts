import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as QRCode from "qrcode";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPaymentConfirmation(
    email: string,
    amount: number,
    link: string
  ): Promise<void> {
    console.log(`Sending payment confirmation to ${email}`);

    // Gera o QR Code como Buffer
    const qrCodeBuffer = await QRCode.toBuffer(link);

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "🎉 Confirmação de Pagamento Recebido!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4f212f; text-align: center;">Pagamento Confirmado! 🎉</h1>
        <p>Olá,</p>
        <p>Estamos felizes em informar que recebemos seu pagamento no valor de <strong>R$ ${amount.toFixed(
          2
        )}</strong>.</p>
        <p>Muito obrigado por escolher nossos serviços! Você já pode acessar seu link clicando no botão abaixo:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${link}" style="background-color: #4f212f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Link com sua história
          </a>
        </div>
        <p>Ou, escaneie o QR Code abaixo para acessar:</p>
        <div style="text-align: center;">
          <img src="cid:qrcode" alt="QR Code" style="max-width: 200px; margin: 20px auto;" />
        </div>
        <p>Se tiver alguma dúvida, estamos à disposição para ajudar.</p>
        <p>Atenciosamente,</p>
        <p><strong>Recordar.me</strong></p>
      </div>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeBuffer,
          cid: "qrcode", // Referência para usar no src do img
        },
      ],
    });
  }
}
