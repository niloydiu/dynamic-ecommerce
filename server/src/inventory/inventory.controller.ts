import { Controller, Post, Body } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

@Controller("api/inventory")
export class InventoryController {
  constructor(private readonly svc: InventoryService) {}

  @Post("update-stock")
  async update(@Body() body: { productId: string; newCount: number }) {
    return this.svc.updateStock(body.productId, body.newCount);
  }
}
