import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  constructor() {}

  async checkHealth() {
    return {
      status: "ok",
    };
  }
}
