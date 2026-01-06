import { Injectable } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";
import { Category } from "../entities/category.entity";

@Injectable()
export class CatalogService {
  private get productRepo() {
    if (!AppDataSource) throw new Error('DataSource not initialized');
    return AppDataSource.getRepository(Product);
  }
  private get categoryRepo() {
    if (!AppDataSource) throw new Error('DataSource not initialized');
    return AppDataSource.getRepository(Category);
  }

  async listCategories() {
    return this.categoryRepo.find();
  }

  async getCategory(id: string) {
    return this.categoryRepo.findOneBy({ id });
  }

  async listProducts(opts: {
    categoryId?: string;
    search?: string;
    filters?: any;
  }) {
    // If using SQLite (fallback), perform simple find + in-memory filtering
    if (AppDataSource && AppDataSource.options.type === 'sqlite') {
      let items = await this.productRepo.find({ where: { active: true } });
      if (opts.categoryId) items = items.filter(i => i.category_id === opts.categoryId);
      if (opts.search) {
        const q = opts.search.toLowerCase();
        items = items.filter(i => (i.sku && i.sku.toLowerCase().includes(q)) || JSON.stringify(i.attributes).toLowerCase().includes(q));
      }
      if (opts.filters && Object.keys(opts.filters).length) {
        items = items.filter(i => {
          for (const k of Object.keys(opts.filters)) {
            if (i.attributes == null) return false;
            const val = opts.filters[k];
            if (i.attributes[k] == null) return false;
            if (Array.isArray(val)) {
              if (!val.includes(i.attributes[k])) return false;
            } else {
              if (i.attributes[k] != val) return false;
            }
          }
          return true;
        });
      }
      return items;
    }

    const qb = this.productRepo.createQueryBuilder('p').where('p.active = true');
    if (opts.categoryId) qb.andWhere('p.category_id = :cid', { cid: opts.categoryId });
    if (opts.search) qb.andWhere('LOWER(p.sku) LIKE :q OR LOWER(p.attributes::text) LIKE :q', { q: `%${opts.search.toLowerCase()}%` });
    if (opts.filters && Object.keys(opts.filters).length) {
      qb.andWhere('p.attributes @> :f', { f: JSON.stringify(opts.filters) });
    }
    return qb.getMany();
  }

  async seedIfEmpty() {
    const cats = await this.categoryRepo.count();
    if (cats === 0) {
      const dress = this.categoryRepo.create({
        name: "Dress",
        attribute_schema: {
          age: ["Kids", "Teen", "Adult"],
          gender: ["Male", "Female", "Unisex"],
        },
      });
      const watch = this.categoryRepo.create({
        name: "Watch",
        attribute_schema: {
          material: ["Leather", "Steel", "Plastic"],
          type: ["Analog", "Digital", "Smart"],
        },
      });
      await this.categoryRepo.save([dress, watch]);
    }
    const prodCount = await this.productRepo.count();
    if (prodCount === 0) {
      const p1 = this.productRepo.create({
        sku: "DRESS-001",
        category_id: (await this.categoryRepo.findOneBy({ name: "Dress" })).id,
        price: 49.99,
        inventory_count: 5,
        attributes: { age: "Adult", gender: "Female" },
      });
      const p2 = this.productRepo.create({
        sku: "WATCH-001",
        category_id: (await this.categoryRepo.findOneBy({ name: "Watch" })).id,
        price: 199.99,
        inventory_count: 10,
        attributes: { material: "Steel", type: "Analog" },
      });
      await this.productRepo.save([p1, p2]);
    }
  }
}
