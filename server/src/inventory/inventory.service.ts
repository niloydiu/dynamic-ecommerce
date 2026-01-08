import { Injectable } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";
import { enqueueJob } from "../queue/queue.service";

@Injectable()
export class InventoryService {
  private get productRepo() {
    if (!AppDataSource) throw new Error("DataSource not initialized");
    return AppDataSource.getRepository(Product);
  }

  async updateStock(productId: string, newCount: number) {
    const p = await this.productRepo.findOneBy({ id: productId });
    if (!p) throw new Error("Product not found");
    const prev = p.stock || 0;
    p.stock = newCount;
    await this.productRepo.save(p);
    // detect 0 -> >0
    if (prev === 0 && newCount > 0) {
      // enqueue restock job
      await enqueueJob("product_restock", { productId: p.id });
    }
    return p;
  }
}
