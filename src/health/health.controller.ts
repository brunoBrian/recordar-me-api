import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { HealthService } from "./health.service";

@ApiTags("health")
@Controller("/")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get("/")
  @ApiOperation({ summary: "Generate PIX payment QR Code" })
  async createPixPayment() {
    return this.healthService.checkHealth();
  }
}
