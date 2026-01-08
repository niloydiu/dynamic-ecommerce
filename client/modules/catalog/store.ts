import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CatalogFilters, Product, Category } from "./types";

interface CatalogState {
  // Products
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  // Filters and pagination
  filters: CatalogFilters;
  categories: Category[];
  totalProducts: number;
  currentPage: number;

  // Actions
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<CatalogFilters>) => void;
  setCategories: (categories: Category[]) => void;
  setTotalProducts: (total: number) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

const defaultFilters: CatalogFilters = {
  sortBy: "newest",
  limit: 12,
  page: 1,
};

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
      setProducts: (products) =>
        set((state) => (state.products === products ? state : { products })),
      setSelectedProduct: (selectedProduct) =>
        set((state) =>
          state.selectedProduct === selectedProduct
            ? state
            : { selectedProduct }
        ),
      setIsLoading: (isLoading) =>
        set((state) => (state.isLoading === isLoading ? state : { isLoading })),
      setError: (error) =>
        set((state) => (state.error === error ? state : { error })),
      setFilters: (newFilters) =>
        set((state) => {
          const keys = Object.keys(newFilters) as (keyof CatalogFilters)[];
          const changed = keys.some(
            (k) => (state.filters as any)[k] !== (newFilters as any)[k]
          );
          if (!changed) return state;
          return {
            filters: { ...state.filters, ...newFilters },
          };
        }),
      setCategories: (categories) =>
        set((state) =>
          state.categories === categories ? state : { categories }
        ),
      setTotalProducts: (total) =>
        set((state) =>
          state.totalProducts === total ? state : { totalProducts: total }
        ),
      setCurrentPage: (page) =>
        set((state) =>
          state.currentPage === page ? state : { currentPage: page }
        ),
      resetFilters: () =>
        set((state) => {
          if (state.filters === defaultFilters && state.currentPage === 1)
            return state;
          return {
            filters: defaultFilters,
            currentPage: 1,
          };
        }),
    }),
    {
      name: "catalog-store",
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);
