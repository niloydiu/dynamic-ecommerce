import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CatalogFilters, Product, Category } from "./types"

interface CatalogState {
  // Products
  products: Product[]
  selectedProduct: Product | null
  isLoading: boolean
  error: string | null

  // Filters and pagination
  filters: CatalogFilters
  categories: Category[]
  totalProducts: number
  currentPage: number

  // Actions
  setProducts: (products: Product[]) => void
  setSelectedProduct: (product: Product | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setFilters: (filters: Partial<CatalogFilters>) => void
  setCategories: (categories: Category[]) => void
  setTotalProducts: (total: number) => void
  setCurrentPage: (page: number) => void
  resetFilters: () => void
}

const defaultFilters: CatalogFilters = {
  sortBy: "newest",
  limit: 12,
  page: 1,
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      // Initial state
      products: [],
      selectedProduct: null,
      isLoading: false,
      error: null,
      filters: defaultFilters,
      categories: [],
      totalProducts: 0,
      currentPage: 1,

      // Actions
      setProducts: (products) => set({ products }),
      setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      setCategories: (categories) => set({ categories }),
      setTotalProducts: (total) => set({ totalProducts: total }),
      setCurrentPage: (page) => set({ currentPage: page }),
      resetFilters: () =>
        set({
          filters: defaultFilters,
          currentPage: 1,
        }),
    }),
    {
      name: "catalog-store",
      partialize: (state) => ({
        filters: state.filters,
      }),
    },
  ),
)
