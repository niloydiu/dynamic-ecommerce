import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatalogModule } from "./catalog/catalog.module";
import { EngagementModule } from "./engagement/engagement.module";
import { InventoryModule } from "./inventory/inventory.module";

@Module({
  imports: [CatalogModule, EngagementModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
