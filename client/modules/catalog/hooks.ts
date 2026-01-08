"use client";

import { useCallback } from "react";
import { useCatalogStore } from "./store";
import { getProducts, searchProducts } from "./actions.server";
import type { CatalogFilters } from "./types";

export function useProducts() {
  const products = useCatalogStore((s) => s.products);
  const isLoading = useCatalogStore((s) => s.isLoading);
  const error = useCatalogStore((s) => s.error);

  const fetchProducts = useCallback(
    async (filters?: Partial<CatalogFilters>) => {
      const state = useCatalogStore.getState();
      if (state.isLoading) {
        return;
      }

      state.setIsLoading(true);
      state.setError(null);

      const mergedFilters = { ...state.filters, ...filters };
      const result = await getProducts(mergedFilters);

      if (!result.data) {
        state.setError("Failed to fetch products");
        state.setProducts([]);
      } else {
        state.setProducts(result.data.products);
        state.setTotalProducts(result.data.total);
        state.setCurrentPage(result.data.page);

        const keys = Object.keys(mergedFilters) as (keyof CatalogFilters)[];
        const different = keys.some(
          (k) => (state.filters as any)[k] !== (mergedFilters as any)[k]
        );
        if (different) {
          state.setFilters(mergedFilters);
        }
      }

      state.setIsLoading(false);
    },
    []
  ); // Stable: no dependencies

  return {
    products,
    isLoading,
    error,
    fetchProducts,
  };
}

export function useFilters() {
  const filters = useCatalogStore((s) => s.filters);
  const resetFilters = useCatalogStore((s) => s.resetFilters);

  const updateFilters = useCallback((newFilters: Partial<CatalogFilters>) => {
    const state = useCatalogStore.getState();
    state.setFilters(newFilters);
    state.setCurrentPage(1);
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}

export function useCatalog() {
  const products = useCatalogStore((s) => s.products);
  const selectedProduct = useCatalogStore((s) => s.selectedProduct);
  const isLoading = useCatalogStore((s) => s.isLoading);
  const error = useCatalogStore((s) => s.error);
  const filters = useCatalogStore((s) => s.filters);
  const categories = useCatalogStore((s) => s.categories);
  const totalProducts = useCatalogStore((s) => s.totalProducts);
  const currentPage = useCatalogStore((s) => s.currentPage);

  const { fetchProducts } = useProducts();

  const setSelectedProduct = useCatalogStore((s) => s.setSelectedProduct);
  const setCategories = useCatalogStore((s) => s.setCategories);
  const updateFilters = useCatalogStore((s) => s.setFilters);
  const resetFilters = useCatalogStore((s) => s.resetFilters);

  return {
    products,
    selectedProduct,
    isLoading,
    error,
    filters,
    categories,
    totalProducts,
    currentPage,
    fetchProducts,
    setSelectedProduct,
    setCategories,
    updateFilters,
    resetFilters,
  };
}

export function useSearch() {
  const search = useCallback(async (query: string) => {
    const store = useCatalogStore.getState();
    if (!query.trim()) {
      store.setProducts([]);
      return;
    }

    store.setIsLoading(true);
    store.setError(null);

    const result = await searchProducts(query);

    if (result.error) {
      store.setError(result.error.message);
    } else if (result.data) {
      store.setProducts(result.data.products);
      store.setTotalProducts(result.data.total);
    }

    store.setIsLoading(false);
  }, []);

  return { search };
}
