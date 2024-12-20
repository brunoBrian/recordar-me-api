import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { StoryModule } from "./story/story.module";
import { PaymentModule } from "./payment/payment.module";
import { MulterMainModule } from "./multer/app.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StoryModule,
    PaymentModule,
    MulterMainModule,
  ],
})
export class AppModule {}
