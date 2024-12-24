import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Add global prefix
  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Story API")
    .setDescription("API for managing stories and payments")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(3000);
}
bootstrap();
