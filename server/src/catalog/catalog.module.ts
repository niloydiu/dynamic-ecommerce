import { Module } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { CatalogController } from "./catalog.controller";
import { CatalogCompatController } from "./catalog.compat.controller";

@Module({
  providers: [CatalogService],
  controllers: [CatalogController, CatalogCompatController],
})
export class CatalogModule {}
