import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { initializeDataSource } from "./data-source";
import { CatalogService } from "./catalog/catalog.service";

async function bootstrap() {
  try {
    const ds = await initializeDataSource();
    console.log("DataSource initialized (type:", ds.options.type, ")");
    // create GIN index when using Postgres
    try {
      if (ds.options.type === "postgres") {
        await ds.query(
          `CREATE INDEX IF NOT EXISTS idx_products_attributes ON products USING GIN (attributes jsonb_path_ops);`
        );
      }
    } catch (err) {
      console.warn(
        "Could not create GIN index (may be using SQLite or Postgres unavailable).",
        err && err.message ? err.message : err
      );
    }
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    });

    // seed minimal data if empty
    const catalog = app.get(CatalogService);
    await catalog.seedIfEmpty();

    // initialize optional queue (BullMQ) — will fallback to immediate processing
    try {
      const { initQueue } = require("./queue/queue.service");
      await initQueue();
      // register an immediate handler used when BullMQ isn't present: process restock by marking requests notified
      const { registerImmediateHandler } = require("./queue/queue.service");
      const { StockRequest } = require("./entities/stock-request.entity");
      registerImmediateHandler(async (name: string, data: any) => {
        if (name === "product_restock") {
          const repo = ds.getRepository(StockRequest as any);
          const pending = await repo.find({
            where: { product_id: data.productId, is_notified: false },
          });
          for (const req of pending) {
            console.log(
              "Immediate handler: notifying",
              req.email || req.user_id,
              "for product",
              data.productId
            );
            req.is_notified = true;
            await repo.save(req);
          }
        }
      });
    } catch (e) {
      console.warn(
        "Queue init failed or not present:",
        e && e.message ? e.message : e
      );
    }

    await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
    console.log("Nexus server listening on port", process.env.PORT || 4000);
  } catch (err) {
    console.error("Failed to bootstrap", err);
    process.exit(1);
  }
}

bootstrap();
