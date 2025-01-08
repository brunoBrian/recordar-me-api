import { MulterModule } from "@nestjs/platform-express";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB
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
