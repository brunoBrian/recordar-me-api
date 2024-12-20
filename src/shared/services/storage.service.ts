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
    const fileBuffer = file.buffer;

    const fileRef = bucket.file(fileName);
    await fileRef.save(fileBuffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Get public URL
    await fileRef.makePublic();
    return fileRef.publicUrl();
  }
}
