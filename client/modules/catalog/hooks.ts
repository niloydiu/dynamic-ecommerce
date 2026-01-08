"use client"

import { useCallback } from "react"
import { useCatalogStore } from "./store"
import { getProducts, searchProducts } from "./actions.server"
import type { CatalogFilters } from "./types"

export function useProducts() {
  const store = useCatalogStore()

  const fetchProducts = useCallback(
    async (filters?: Partial<CatalogFilters>) => {
      store.setIsLoading(true)
      store.setError(null)

      const mergedFilters = { ...store.filters, ...filters }
      const result = await getProducts(mergedFilters)

      if (!result.data) {
        store.setError('Failed to fetch products')
        store.setProducts([])
      } else {
        store.setProducts(result.data.products)
        store.setTotalProducts(result.data.total)
        store.setCurrentPage(result.data.page)
        store.setFilters(mergedFilters)
      }

      store.setIsLoading(false)
    },
    [store],
  )

  return {
    products: store.products,
    isLoading: store.isLoading,
    error: store.error,
    fetchProducts,
  }
}

export function useFilters() {
  const store = useCatalogStore()

  const updateFilters = useCallback(
    (filters: Partial<CatalogFilters>) => {
      store.setFilters(filters)
      store.setCurrentPage(1)
    },
    [store],
  )

  return {
    filters: store.filters,
    updateFilters,
    resetFilters: store.resetFilters,
  }
}

export function useCatalog() {
  const store = useCatalogStore()
  const { fetchProducts } = useProducts()

  return {
    products: store.products,
    selectedProduct: store.selectedProduct,
    isLoading: store.isLoading,
    error: store.error,
    filters: store.filters,
    categories: store.categories,
    totalProducts: store.totalProducts,
    currentPage: store.currentPage,
    fetchProducts,
    setSelectedProduct: store.setSelectedProduct,
    setCategories: store.setCategories,
    updateFilters: (filters: Partial<CatalogFilters>) => store.setFilters(filters),
    resetFilters: store.resetFilters,
  }
}

export function useSearch() {
  const store = useCatalogStore()

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        store.setProducts([])
        return
      }

      store.setIsLoading(true)
      store.setError(null)

      const result = await searchProducts(query)

      if (result.error) {
        store.setError(result.error.message)
      } else if (result.data) {
        store.setProducts(result.data.products)
        store.setTotalProducts(result.data.total)
      }

      store.setIsLoading(false)
    },
    [store],
  )

  return { search }
}
