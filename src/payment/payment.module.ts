import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { EmailService } from "../shared/services/email.service";

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, EmailService],
})
export class PaymentModule {}
