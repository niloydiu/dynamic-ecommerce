import { Controller, Get, Query, Param } from "@nestjs/common";
import { CatalogService } from "./catalog.service";

// Compatibility controller: expose legacy routes under `/catalog/*` to
// support frontends that expect that base path.
@Controller("catalog")
export class CatalogCompatController {
  constructor(private readonly svc: CatalogService) {}

  @Get("categories")
  async categories() {
    return this.svc.listCategories();
  }

  @Get("categories/:id")
  async category(@Param("id") id: string) {
    return this.svc.getCategory(id);
  }

  @Get("products")
  async products(
    @Query("categoryId") categoryId: string,
    @Query("search") search: string,
    @Query("filters") filters: string
  ) {
    let f = {};
    if (filters) {
      try {
        f = JSON.parse(filters);
      } catch (e) {
        f = {};
      }
    }
    const products = await this.svc.listProducts({ categoryId, search, filters: f });
    return {
      products,
      total: products.length,
      page: 1,
      limit: 100,
      hasMore: false,
    };
  }
}
