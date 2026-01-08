"use client"

import { useCallback } from "react"
import { useEngagementStore } from "./store"
import { getProductComments, addComment as addCommentAction, addToWishlist, removeFromWishlist } from "./actions.server"

export function useComments(productId: string) {
  const store = useEngagementStore()

  const fetchComments = useCallback(async () => {
    store.setIsLoadingComments(true)
    const result = await getProductComments(productId)

    if (result.error) {
      store.setCommentError(result.error.message)
    } else if (result.data) {
      store.setComments(result.data)
      store.setCommentError(null)
    }

    store.setIsLoadingComments(false)
  }, [productId, store])

  const addComment = useCallback(
    async (content: string, rating: number, userId: string) => {
      const result = await addCommentAction(productId, content, rating, userId)

      if (result.error) {
        store.setCommentError(result.error.message)
        return { success: false }
      }

      if (result.data) {
        store.setComments([...store.comments, result.data])
        return { success: true, data: result.data }
      }

      return { success: false }
    },
    [productId, store],
  )

  return {
    comments: store.comments,
    isLoading: store.isLoadingComments,
    error: store.commentError,
    fetchComments,
    addComment,
  }
}

export function useWishlist(userId?: string) {
  const store = useEngagementStore()

  const addToWishlistAction = useCallback(
    async (productId: string) => {
      if (!userId) {
        store.setWishlistError("Please sign in to add items to your wishlist")
        return { success: false }
      }

      const result = await addToWishlist(productId, userId)

      if (result.error) {
        store.setWishlistError(result.error.message)
        return { success: false }
      }

      if (result.data) {
        store.addWishlistItem(result.data)
        return { success: true }
      }

      return { success: false }
    },
    [userId, store],
  )

  const removeFromWishlistAction = useCallback(
    async (itemId: string) => {
      const result = await removeFromWishlist(itemId)

      if (result.error) {
        store.setWishlistError(result.error.message)
        return { success: false }
      }

      if (result.data?.success) {
        store.removeWishlistItem(itemId)
        return { success: true }
      }

      return { success: false }
    },
    [store],
  )

  return {
    wishlistItems: store.wishlistItems,
    isLoading: store.isLoadingWishlist,
    error: store.wishlistError,
    addToWishlist: addToWishlistAction,
    removeFromWishlist: removeFromWishlistAction,
    isInWishlist: (productId: string) => store.isInWishlist(productId),
  }
}
