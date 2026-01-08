import { create } from "zustand"
import type { Comment, WishlistItem } from "./types"

interface EngagementState {
  // Comments
  comments: Comment[]
  isLoadingComments: boolean
  commentError: string | null

  // Wishlist
  wishlistItems: WishlistItem[]
  isLoadingWishlist: boolean
  wishlistError: string | null

  // Actions
  setComments: (comments: Comment[]) => void
  setIsLoadingComments: (loading: boolean) => void
  setCommentError: (error: string | null) => void
  setWishlistItems: (items: WishlistItem[]) => void
  setIsLoadingWishlist: (loading: boolean) => void
  setWishlistError: (error: string | null) => void
  addWishlistItem: (item: WishlistItem) => void
  removeWishlistItem: (itemId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useEngagementStore = create<EngagementState>((set, get) => ({
  // Initial state
  comments: [],
  isLoadingComments: false,
  commentError: null,
  wishlistItems: [],
  isLoadingWishlist: false,
  wishlistError: null,

  // Actions
  setComments: (comments) => set({ comments }),
  setIsLoadingComments: (isLoadingComments) => set({ isLoadingComments }),
  setCommentError: (commentError) => set({ commentError }),
  setWishlistItems: (wishlistItems) => set({ wishlistItems }),
  setIsLoadingWishlist: (isLoadingWishlist) => set({ isLoadingWishlist }),
  setWishlistError: (wishlistError) => set({ wishlistError }),
  addWishlistItem: (item) => set((state) => ({ wishlistItems: [...state.wishlistItems, item] })),
  removeWishlistItem: (itemId) =>
    set((state) => ({
      wishlistItems: state.wishlistItems.filter((item) => item.id !== itemId),
    })),
  isInWishlist: (productId) => {
    const state = get()
    return state.wishlistItems.some((item) => item.productId === productId)
  },
}))
