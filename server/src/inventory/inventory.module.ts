import { Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { InventoryController } from "./inventory.controller";
import { InventoryCompatController } from "./inventory.compat.controller";

@Module({
  providers: [InventoryService],
  controllers: [InventoryController, InventoryCompatController],
})
export class InventoryModule {}
