import { Injectable } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { Wishlist } from "../entities/wishlist.entity";
import { Reaction } from "../entities/reaction.entity";
import { Comment } from "../entities/comment.entity";
import { StockRequest } from "../entities/stock-request.entity";
import { Product } from "../entities/product.entity";

@Injectable()
export class EngagementService {
  private get wishlistRepo() {
    if (!AppDataSource) throw new Error("DataSource not initialized");
    return AppDataSource.getRepository(Wishlist);
  }
  private get reactionRepo() {
    if (!AppDataSource) throw new Error("DataSource not initialized");
    return AppDataSource.getRepository(Reaction);
  }
  private get commentRepo() {
    if (!AppDataSource) throw new Error("DataSource not initialized");
    return AppDataSource.getRepository(Comment);
  }
  private get stockReqRepo() {
    if (!AppDataSource) throw new Error("DataSource not initialized");
    return AppDataSource.getRepository(StockRequest);
  }
  private get productRepo() {
    if (!AppDataSource) throw new Error("DataSource not initialized");
    return AppDataSource.getRepository(Product);
  }

  async toggleWishlist(userId: string, productId: string) {
    const existing = await this.wishlistRepo.findOneBy({
      user_id: userId,
      product_id: productId,
    });
    if (existing) {
      await this.wishlistRepo.remove(existing);
      return { removed: true };
    }
    const w = this.wishlistRepo.create({
      user_id: userId,
      product_id: productId,
    });
    await this.wishlistRepo.save(w);
    return { added: true };
  }

  async addReaction(userId: string, productId: string, reaction: string) {
    const existing = await this.reactionRepo.findOneBy({
      user_id: userId,
      product_id: productId,
    });
    if (existing) throw new Error("You already reacted to this product");
    const r = this.reactionRepo.create({
      user_id: userId,
      product_id: productId,
      reaction,
    });
    await this.reactionRepo.save(r);
    return r;
  }

  async addComment(userId: string, productId: string, text: string) {
    if (text.length > 500) throw new Error("Comment too long");
    const c = this.commentRepo.create({
      user_id: userId,
      product_id: productId,
      text,
    });
    await this.commentRepo.save(c);
    return c;
  }

  async getComments(productId: string) {
    return this.commentRepo.find({
      where: { product_id: productId },
      order: { created_at: "DESC" },
    });
  }

  async requestStock({
    userId,
    email,
    productId,
  }: {
    userId?: string;
    email?: string;
    productId: string;
  }) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new Error("Product not found");
    if (product.inventory_count > 0) throw new Error("Stock is available");
    // prevent duplicate for same email/user+product
    const existing = email
      ? await this.stockReqRepo.findOneBy({ email, product_id: productId })
      : userId
      ? await this.stockReqRepo.findOneBy({
          user_id: userId,
          product_id: productId,
        })
      : null;
    if (existing) return { already: true };
    const s = this.stockReqRepo.create({
      user_id: userId,
      email,
      product_id: productId,
    });
    await this.stockReqRepo.save(s);
    return { submitted: true };
  }

  async getStockRequests(productId: string) {
    return this.stockReqRepo.find({ where: { product_id: productId } });
  }
}
