import { create } from "zustand"
import type { StockInfo } from "./types"

interface InventoryState {
  // Stock information
  stockInfo: Record<string, StockInfo>
  isLoading: boolean
  error: string | null

  // Actions
  setStockInfo: (productId: string, info: StockInfo) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  getStockInfo: (productId: string) => StockInfo | null
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  // Initial state
  stockInfo: {},
  isLoading: false,
  error: null,

  // Actions
  setStockInfo: (productId, info) =>
    set((state) => ({
      stockInfo: {
        ...state.stockInfo,
        [productId]: info,
      },
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getStockInfo: (productId) => {
    const state = get()
    return state.stockInfo[productId] || null
  },
}))
