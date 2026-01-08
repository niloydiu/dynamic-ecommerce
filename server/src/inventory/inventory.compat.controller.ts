import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";

@Controller("inventory")
export class InventoryCompatController {
  constructor(private readonly svc: InventoryService) {}

  @Get("stock/:id")
  async getStock(@Param("id") id: string) {
    if (!AppDataSource) throw new Error("DataSource not initialized");
    const repo = AppDataSource.getRepository(Product);
    const product = await repo.findOneBy({ id } as any);
    if (!product) throw new NotFoundException("Product not found");
    return {
      productId: product.id,
      stock: product.stock,
      available: product.stock > 0,
    };
  }

  @Post("reserve")
  async reserve(@Body() body: { productId: string; quantity: number }) {
    if (!AppDataSource) throw new Error("DataSource not initialized");
    const repo = AppDataSource.getRepository(Product);
    const product = await repo.findOneBy({ id: body.productId } as any);
    if (!product) throw new NotFoundException("Product not found");

    if (product.stock < body.quantity) {
      throw new BadRequestException("Not enough stock");
    }

    product.stock -= body.quantity;
    await repo.save(product);

    return {
      reserved: true,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }
}
