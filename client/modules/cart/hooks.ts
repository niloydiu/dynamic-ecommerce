"use client"

import { useCallback } from "react"
import { useCartStore } from "./store"
import { validateStock } from "./actions.server"
import type { CartItem } from "./types"

// Simple UUID generator for client-side use
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function useCart() {
  const store = useCartStore()

  return {
    items: store.items,
    subtotal: store.subtotal,
    tax: store.tax,
    shipping: store.shipping,
    total: store.total,
    itemCount: store.itemCount,
    isLoading: store.isLoading,
    error: store.error,
  }
}

export function useAddToCart() {
  const store = useCartStore()

  const addToCart = useCallback(
    async (
      product: { id: string; name: string; price: number; originalPrice?: number; image: string },
      quantity: number,
    ) => {
      const stockValidation = await validateStock(product.id, quantity)

      if (stockValidation.available === false) {
        store.setError("Product is out of stock or insufficient quantity")
        return { success: false, error: stockValidation.error }
      }

      // Create cart item
      const cartItem: CartItem = {
        id: generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity,
      }

      // Optimistic update
      store.addItem(cartItem)
      store.setError(null)

      return { success: true }
    },
    [store],
  )

  return { addToCart }
}

export function useRemoveFromCart() {
  const store = useCartStore()

  const removeFromCart = useCallback(
    (itemId: string) => {
      store.removeItem(itemId)
    },
    [store],
  )

  return { removeFromCart }
}

export function useUpdateCartQuantity() {
  const store = useCartStore()

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return

      // Update optimistically
      store.updateQuantity(itemId, quantity)
    },
    [store],
  )

  return { updateQuantity }
}

export function useClearCart() {
  const store = useCartStore()

  const clearCart = useCallback(() => {
    store.clearCart()
  }, [store])

  return { clearCart }
}
