import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class StorageService {
  private storage: admin.storage.Storage;

  constructor() {
    this.storage = admin.storage();
  }

  async uploadFile(file: any): Promise<string> {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const bucket = this.storage.bucket();

    const fileRef = bucket.file(fileName);

    if (file.path) {
      // Upload from disk (Multer DiskStorage)
      await bucket.upload(file.path, {
        destination: fileName,
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Clean up local temp file
      const fs = require("fs");
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Error deleting temp file:", err);
      }
    } else {
      // Upload from buffer (Multer MemoryStorage fallback)
      const fileBuffer = file.buffer;
      await fileRef.save(fileBuffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
    }

    // Get public URL
    await fileRef.makePublic();
    return fileRef.publicUrl();
  }
}
