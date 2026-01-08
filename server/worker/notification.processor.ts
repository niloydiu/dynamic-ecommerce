import "reflect-metadata";
import {
  initializeDataSource,
  AppDataSource as _unused,
} from "../src/data-source";
import { StockRequest } from "../src/entities/stock-request.entity";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

async function run() {
  const ds = await initializeDataSource();
  console.log("Worker: DataSource initialized (type:", ds.options.type, ")");
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  let connection: Redis | null = null;
  try {
    connection = new Redis(redisUrl);
    await connection.ping();
  } catch (err) {
    console.warn(
      "Worker: Redis not available, exiting worker (no queue to process)."
    );
    process.exit(0);
  }
  const worker = new Worker(
    "notifications",
    async (job) => {
      if (job.name === "product_restock") {
        const { productId } = job.data;
        console.log("Worker: processing restock for", productId);
        const repo = ds.getRepository(StockRequest);
        const pending = await repo.find({
          where: { product_id: productId, is_notified: false },
        });
        for (const req of pending) {
          // simulate email send
          console.log(
            `Worker: notifying ${
              req.email || req.user_id
            } about product ${productId}`
          );
          req.is_notified = true;
          await repo.save(req);
        }
      }
    },
    { connection: { url: redisUrl } }
  );

  worker.on("completed", (job) => console.log("Worker: job completed", job.id));
  worker.on("failed", (job, err) =>
    console.error("Worker: job failed", job?.id, err)
  );
}

run().catch((err) => {
  console.error("Worker failed", err);
  process.exit(1);
});
