"use server"

import type { Comment, Reaction, WishlistItem } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<{ data?: T; error?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json()
      return { error }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error(`[v0] API Error at ${endpoint}:`, error)
    return { error: { message: "Failed to connect to server" } }
  }
}

// Get comments for product
export async function getProductComments(productId: string) {
  return fetchFromAPI<Comment[]>(`/engagement/comments?productId=${productId}`)
}

// Add comment to product
export async function addComment(productId: string, content: string, rating: number, userId: string) {
  return fetchFromAPI<Comment>("/engagement/comments", {
    method: "POST",
    body: JSON.stringify({ productId, content, rating, userId }),
  })
}

// Add reaction to product
export async function addReaction(productId: string, type: string, userId: string) {
  return fetchFromAPI<Reaction>("/engagement/reactions", {
    method: "POST",
    body: JSON.stringify({ productId, type, userId }),
  })
}

// Get user wishlist
export async function getUserWishlist(userId: string) {
  return fetchFromAPI<WishlistItem[]>(`/engagement/wishlist?userId=${userId}`)
}

// Add to wishlist
export async function addToWishlist(productId: string, userId: string) {
  return fetchFromAPI<WishlistItem>("/engagement/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId, userId }),
  })
}

// Remove from wishlist
export async function removeFromWishlist(wishlistItemId: string) {
  return fetchFromAPI<{ success: boolean }>(`/engagement/wishlist/${wishlistItemId}`, {
    method: "DELETE",
  })
}
