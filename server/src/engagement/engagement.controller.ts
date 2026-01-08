import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { EngagementService } from "./engagement.service";

@Controller("api/engagement")
export class EngagementController {
  constructor(private readonly svc: EngagementService) {}

  @Post("wishlist")
  async wishlist(@Body() body: { userId: string; productId: string }) {
    const { userId, productId } = body;
    return this.svc.toggleWishlist(userId, productId);
  }

  @Post("reaction")
  async reaction(
    @Body() body: { userId: string; productId: string; reaction: string }
  ) {
    const { userId, productId, reaction } = body;
    return this.svc.addReaction(userId, productId, reaction);
  }

  @Post("comments")
  async comment(
    @Body() body: { userId: string; productId: string; text: string }
  ) {
    const { userId, productId, text } = body;
    return this.svc.addComment(userId, productId, text);
  }

  @Get("comments")
  async getComments(@Query("productId") productId: string) {
    return this.svc.getComments(productId);
  }

  @Get("stock-requests")
  async getStockRequests(@Query("productId") productId: string) {
    return this.svc.getStockRequests(productId);
  }

  @Post("stock-requests")
  async stockRequest(
    @Body() body: { userId?: string; email?: string; productId: string }
  ) {
    return this.svc.requestStock(body);
  }
}
