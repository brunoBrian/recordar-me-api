import { MulterModule } from "@nestjs/platform-express";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5 MB por arquivo
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
          return callback(new Error("Apenas imagens são permitidas"), false);
        }
        callback(null, true);
      },
    }),
  ],
})
export class MulterMainModule {}
