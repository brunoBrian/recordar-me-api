import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

console.log({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
});

@Injectable()
export class FirebaseService {
  private firestore: admin.firestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: "recordar-me",
          clientEmail:
            "firebase-adminsdk-y5hc7@recordar-me.iam.gserviceaccount.com",
          privateKey:
            "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDNdYmPpajSMe38\nArDOvQomM2S/qUKSsuLy19tpglEw3XNOEGXm4oyoqB8/CWCuokwEBaxaw6pHxf6S\ns/c+nDZ2VsQplvLlNYB+cdS60m4aVqhjFtbzcn8moPrn+5jyndB4CKfZwP3KRSqd\nXeyfBg9jcDHC3ingNtqG962Z8jNNbzuFddh/CHX0Wkd6jFbKm7ES/Mtrl82Fj2Ki\nEpQef3R7Q3uavKLNIFELxg5ChtStTCnrq/S57wfDbPbPzka63puA4B0AP3RhV97X\nwK5uIR3Pa1TxnWfSe1aOfdBm2hlH+wPcKPDRa9Cs/q9wU2M1cVx6PDJFxSUqcHwd\n0ruP3m0RAgMBAAECggEAEpDGZ2aOxL+iQ51yoJvQaPdH6VHAJEVp4IvE1dniwEmi\ne7Fbo+tgznSyrh2I0P71Y3+nvWPk5Sts/5CnjM7M1RCuFRwAwtl8zPA4StFtBZBD\nEwEjV0hHWRQ+1+uSPIoqJk6R7ElWJYrueN3d3djMVy3yMSumGQ6b3IpQ85JBNIPp\nICuKxMbYFdlSyl27vTALmlqPKU4XEyMbYITPTE0jgfw9PTI+LsYnSkF+wdce01xC\n+51RuhsQeSRwiHLHZHsolR0AmV0q6Q2uZ3Yu7TRQzYYOE1RVqRO1wPV3ktwiy1Os\nNaxaS9sQPyB27orjVzFxJb7IhzMal9A8fflRAPdMyQKBgQDuh1/Q6f+Az1zqoSXU\n0Wgy//hhYswJeVwn0sKz0WcbaMrB4YDbELQNy88c/QE5PiPRK/Cf34jsnSg/wUiF\n2lkXreuZbB8rCmxiwgtLFgSl0T/5UPYgMIkibwjrbRlD9MsxCiyczkHMurRn8bqp\nK6BeFeHjzE1OqrUP11jtW+7/LwKBgQDcghPT3e9qWcETBzM75zoztCqmNuj40euI\nz3oTQ056e4cyh168XbzWjiys031zjn6dv0lSoU2G8+krvFTTUw25wvp98WxxiFkM\nrazP3+HDkD693qAlxEv/Lp7NnjUiH0rRdxhBVB2lyUdWUlaXidNmWUoKbu+tOBwR\nqLMVmrhHvwKBgHitqu9ig+8iemsGrsI2VBaBZKO4vWwJp3NKcVFSn2zBnttqgKvU\njpPwSk/rPSQ96RcZuPrZuEel10gyPMPjzXFqf6k2h6pZ8q4gaGBLunw+GrTDnlJ4\n29i8/nFF2COGhQrBkAKhY671wvJX3U1bkh4nygpbQb2MJmDmXcpw2cDnAoGAR3cA\n5hFvnpAoOvqCaE+wVUF28RequbmPFG/pqISP0rJmRsIIuhPHN+IsKHcCmYj9EDMG\nmHkenzY9w6bt9u9b63B9roOoGcOO2MUQ1O5CRRdivjaAwLy1xKZfYVR88+ogXXKz\nsbiJQ0nQjPFyjvpkQS9/B5Kcqw8cSbzbDY1vXBECgYAWgwpI/5xqM2eSjGkREpxs\nKBwA5E2KFNCJ3H2Aak44Ktyqj40F4VcE8sNoQGCZvc36cjvM08O+3hzOH9cVgQHR\n/Skl3nExX285I9ZpktrXZ5z0Sv8vpxd1wdhBC2a5OENxQYcHcO1xXDB0NzdM5oS7\n30K0fzoMDOSLUomiGEq7zg==\n-----END PRIVATE KEY-----\n".replace(
              /\\n/g,
              "\n"
            ),
        }),
        storageBucket: "recordar-me.firebasestorage.app",
      });
    }
    this.firestore = admin.firestore();
  }

  async create(collection: string, id: string, data: any): Promise<void> {
    await this.firestore.collection(collection).doc(id).set(data);
  }

  async get(collection: string, id: string): Promise<any> {
    const doc = await this.firestore.collection(collection).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }
}
