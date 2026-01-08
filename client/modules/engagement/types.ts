export interface Comment {
  id: string
  productId: string
  userId: string
  author: string
  content: string
  rating: number
  createdAt: string
  updatedAt: string
  helpful: number
  replies?: Comment[]
}

export interface Reaction {
  id: string
  productId: string
  userId: string
  type: "like" | "love" | "helpful" | "verified"
  createdAt: string
}

export interface WishlistItem {
  id: string
  productId: string
  productName: string
  productImage: string
  productPrice: number
  addedAt: string
}

export interface EngagementError {
  code: string
  message: string
}
