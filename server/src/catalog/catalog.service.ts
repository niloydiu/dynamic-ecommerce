import { Injectable } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";
import { Category } from "../entities/category.entity";

@Injectable()
export class CatalogService {
  private get productRepo() {
    if (!AppDataSource) throw new Error("DataSource not initialized");
    return AppDataSource.getRepository(Product);
  }
  private get categoryRepo() {
    if (!AppDataSource) throw new Error("DataSource not initialized");
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
    if (AppDataSource && AppDataSource.options.type === "sqlite") {
      let items = await this.productRepo.find({ where: { active: true } });
      const categories = await this.categoryRepo.find();
      const catMap = new Map(categories.map((c) => [c.id, c.slug])); // USE SLUG FOR LOGIC

      if (opts.categoryId)
        items = items.filter((i) => i.category_id === opts.categoryId);

      if (opts.search) {
        const q = opts.search.toLowerCase();
        items = items.filter(
          (i) =>
            (i.name && i.name.toLowerCase().includes(q)) ||
            (i.description && i.description.toLowerCase().includes(q)) ||
            (i.sku && i.sku.toLowerCase().includes(q)) ||
            JSON.stringify(i.attributes).toLowerCase().includes(q)
        );
      }
      if (opts.filters && Object.keys(opts.filters).length) {
        items = items.filter((i) => {
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
      return items.map((i) => ({
        ...i,
        category: catMap.get(i.category_id) || "uncategorized",
      }));
    }

    const qb = this.productRepo
      .createQueryBuilder("p")
      .leftJoin("product_categories", "c", "p.category_id = c.id")
      .select([
        "p.id as id",
        "p.name as name",
        "p.slug as slug",
        "p.description as description",
        "p.sku as sku",
        "p.price as price",
        'p.originalPrice as "originalPrice"',
        "p.image as image",
        "p.stock as stock",
        "p.rating as rating",
        'p.reviewCount as "reviewCount"',
        "p.tags as tags",
        "p.attributes as attributes",
        "c.slug as category",
        "p.active as active",
      ])
      .where("p.active = true");

    if (opts.categoryId)
      qb.andWhere("p.category_id = :cid", { cid: opts.categoryId });

    if (opts.search) {
      qb.andWhere(
        "(LOWER(p.name) LIKE :q OR LOWER(p.description) LIKE :q OR LOWER(p.sku) LIKE :q)",
        {
          q: `%${opts.search.toLowerCase()}%`,
        }
      );
    }

    if (opts.filters && Object.keys(opts.filters).length) {
      qb.andWhere("p.attributes @> :f", { f: JSON.stringify(opts.filters) });
    }

    const raw = await qb.getRawMany();
    // Transform numeric strings back to numbers for price etc if needed, though most drivers handle it.
    return raw.map((r) => ({
      ...r,
      price: Number(r.price),
      originalPrice: r.originalPrice ? Number(r.originalPrice) : null,
      tags: typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags,
      attributes:
        typeof r.attributes === "string"
          ? JSON.parse(r.attributes)
          : r.attributes,
    }));
  }

  async seedIfEmpty() {
    const cats = await this.categoryRepo.count();
    if (cats === 0) {
      const dress = this.categoryRepo.create({
        name: "Dress",
        slug: "dress",
        attribute_schema: {
          age: ["Kids", "Teen", "Adult"],
          gender: ["Male", "Female", "Unisex"],
        },
      });
      const watch = this.categoryRepo.create({
        name: "Watch",
        slug: "watch",
        attribute_schema: {
          material: ["Leather", "Steel", "Plastic"],
          type: ["Analog", "Digital", "Smart"],
        },
      });
      await this.categoryRepo.save([dress, watch]);
    }
    const prodCount = await this.productRepo.count();
    if (prodCount === 0) {
      const dressCat = await this.categoryRepo.findOneBy({ name: "Dress" });
      const watchCat = await this.categoryRepo.findOneBy({ name: "Watch" });

      const p1 = this.productRepo.create({
        name: "Elegant Summer Dress",
        slug: "elegant-summer-dress",
        description: "A beautiful floral dress perfect for summer outings.",
        sku: "DRESS-001",
        category_id: dressCat.id,
        price: 49.99,
        originalPrice: 69.99,
        stock: 50,
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
        rating: 4.5,
        reviewCount: 12,
        tags: ["dress", "summer", "floral"],
        attributes: { age: "Adult", gender: "Female" },
      });
      const p2 = this.productRepo.create({
        name: "Classic Steel Watch",
        slug: "classic-steel-watch",
        description:
          "Timeless analog watch with a durable stainless steel band.",
        sku: "WATCH-001",
        category_id: watchCat.id,
        price: 199.99,
        stock: 10,
        image:
          "https://images.unsplash.com/photo-152327533bc68-675097457351?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewCount: 45,
        tags: ["watch", "classic", "steel"],
        attributes: { material: "Steel", type: "Analog" },
      });
      await this.productRepo.save([p1, p2]);
    }
  }
}
