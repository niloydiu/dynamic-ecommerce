import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Cart } from "./types"

interface CartState extends Cart {
  // Actions
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  syncCart: () => Promise<void>
  isLoading: boolean
  error: string | null
  setError: (error: string | null) => void
  setIsLoading: (loading: boolean) => void
}

const defaultCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  itemCount: 0,
  updatedAt: new Date().toISOString(),
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ...defaultCart,
      isLoading: false,
      error: null,

      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === newItem.productId &&
              JSON.stringify(item.variants || {}) === JSON.stringify(newItem.variants || {}),
          )

          let updatedItems: CartItem[]

          if (existingItem) {
            // Update existing item quantity
            updatedItems = state.items.map((item) =>
              item.id === existingItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item,
            )
          } else {
            // Add new item
            updatedItems = [...state.items, newItem]
          }

          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
          const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const tax = subtotal * 0.08
          const shipping = updatedItems.length > 0 ? 10 : 0

          return {
            items: updatedItems,
            subtotal,
            tax,
            shipping,
            total: subtotal + tax + shipping,
            itemCount,
            updatedAt: new Date().toISOString(),
          }
        }),

      removeItem: (itemId) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== itemId)
          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
          const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const tax = subtotal * 0.08
          const shipping = updatedItems.length > 0 ? 10 : 0

          return {
            items: updatedItems,
            subtotal,
            tax,
            shipping,
            total: subtotal + tax + shipping,
            itemCount,
            updatedAt: new Date().toISOString(),
          }
        }),

      updateQuantity: (itemId, quantity) =>
        set((state) => {
          if (quantity < 1) {
            return state
          }

          const updatedItems = state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
          const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const tax = subtotal * 0.08
          const shipping = updatedItems.length > 0 ? 10 : 0

          return {
            items: updatedItems,
            subtotal,
            tax,
            shipping,
            total: subtotal + tax + shipping,
            itemCount,
            updatedAt: new Date().toISOString(),
          }
        }),

      clearCart: () =>
        set(() => ({
          ...defaultCart,
          updatedAt: new Date().toISOString(),
        })),

      syncCart: async () => {
        // Placeholder for server sync in the future
        set({ isLoading: false })
      },

      setError: (error) => set({ error }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        tax: state.tax,
        shipping: state.shipping,
        total: state.total,
        itemCount: state.itemCount,
        updatedAt: state.updatedAt,
      }),
    },
  ),
)
