"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCatalog, useFilters } from "@/modules/catalog/hooks";
import { useAddToCart } from "@/modules/cart/hooks";
import { FilterSidebar } from "@/modules/catalog/components/filter-sidebar";
import { ProductGrid } from "@/modules/catalog/components/product-grid";
import { SortDropdown } from "@/modules/catalog/components/sort-dropdown";
import { SearchBar } from "@/modules/catalog/components/search-bar";
// Fetch categories directly from backend to ensure client-side filtering works
const CATEGORIES_ENDPOINT = typeof window !== "undefined" ? "http://127.0.0.1:4000/catalog/categories" : undefined;
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CatalogFilters } from "@/modules/catalog/types";

export default function CatalogPage() {
  const {
    products,
    isLoading,
    error,
    filters,
    categories,
    totalProducts,
    currentPage,
    fetchProducts,
    setCategories,
    updateFilters,
  } = useCatalog();
  const { addToCart } = useAddToCart();
  const { resetFilters } = useFilters();
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const searchParams = useSearchParams();

  // Load categories on mount
  useEffect(() => {
    const FALLBACK_CATEGORIES = [
      { id: "1", name: "Electronics", slug: "electronics", description: "Tech gadgets and devices", productCount: 6 },
      { id: "2", name: "Furniture", slug: "furniture", description: "Office and home furniture", productCount: 1 },
      { id: "3", name: "Accessories", slug: "accessories", description: "Tech accessories and add-ons", productCount: 4 },
      { id: "4", name: "Lighting", slug: "lighting", description: "Desk and ambient lighting", productCount: 1 },
      { id: "5", name: "Office", slug: "office", description: "Office supplies and organizers", productCount: 1 },
    ]
    async function loadCategories() {
      try {
        if (CATEGORIES_ENDPOINT) {
          const res = await fetch(CATEGORIES_ENDPOINT, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            setCategories(
              data.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug ?? (c.name || c.id).toLowerCase().replace(/\s+/g, "-"), description: c.description, productCount: c.productCount }))
            );
            setIsLoadingCategories(false);
            return;
          }
        }
      } catch (e) {
        // swallow and fall back to server action/mock
      }

      // Fallback to server-side helper
      try {
        const result = await (await import("@/modules/catalog/actions.server")).getCategories();
        if (result?.data) setCategories(result.data as any);
      } catch (e) {
        // ignore
      }
      // If backend/server didn't provide categories, populate with fallback so UI isn't empty
      const state = await Promise.resolve();
      // give React a tick to ensure setCategories above runs first
      setTimeout(() => {
        // read current categories from store via prop value; if still empty use fallback
        // (we don't import the store here to keep this component simple)
        setCategories((prev: any) => {
          try {
            if (prev && Array.isArray(prev) && prev.length > 0) return prev
          } catch {}
          return FALLBACK_CATEGORIES as any
        })
      }, 0)
      setIsLoadingCategories(false);
    }
    loadCategories();
  }, [setCategories]);

  // Load products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters, fetchProducts]);

  // Sync `category` from URL search params into the store
  useEffect(() => {
    const categoryParam = searchParams?.get("category") || undefined;
    if (categoryParam !== filters.category) {
      // For virtual categories, clear price/search bounds so mock data is visible
      if (categoryParam === "new") {
        updateFilters({ category: categoryParam, page: 1, minPrice: undefined, maxPrice: undefined, search: undefined, sortBy: "newest" });
      } else if (categoryParam === "sale") {
        updateFilters({ category: categoryParam, page: 1, minPrice: undefined, maxPrice: undefined, search: undefined });
      } else {
        updateFilters({ category: categoryParam, page: 1 });
      }
    }
  }, [searchParams, filters.category, updateFilters]);

  const handleCategoryChange = useCallback((category: string | undefined) => {
    updateFilters({ category, page: 1 });
  }, [updateFilters]);

  const handlePriceChange = useCallback((range: [number, number]) => {
    updateFilters({ minPrice: range[0], maxPrice: range[1], page: 1 });
  }, [updateFilters]);

  const handleSortChange = useCallback((sortBy: CatalogFilters["sortBy"]) => {
    updateFilters({ sortBy });
  }, [updateFilters]);

  const handleSearch = useCallback((query: string) => {
    updateFilters({ search: query, page: 1 });
  }, [updateFilters]);

  const handlePageChange = useCallback((newPage: number) => {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateFilters]);

  const handleReset = useCallback(() => {
    resetFilters();
    updateFilters({ page: 1 });
  }, [resetFilters, updateFilters]);

  const totalPages = Math.ceil(totalProducts / (filters.limit || 12));
  const isEmpty = !isLoading && products.length === 0;

  // Memoize priceRange array to prevent unnecessary re-renders in children
  const priceRange = useMemo<[number, number]>(() => [
    filters.minPrice ?? 0,
    filters.maxPrice ?? 1000
  ], [filters.minPrice, filters.maxPrice]);

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Shop Our Collection
          </h1>
          <p className="text-muted-foreground">
            Browse our curated selection of premium products
          </p>
        </div>

        {/* Main Content */}
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              selectedCategory={filters.category}
              priceRange={priceRange}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onReset={handleReset}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1 space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <SortDropdown
                value={filters.sortBy}
                onChange={handleSortChange}
              />
            </div>

            {/* Results Count */}
            {!isEmpty && (
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * (filters.limit || 12) + 1} to{" "}
                {Math.min(currentPage * (filters.limit || 12), totalProducts)}{" "}
                of {totalProducts} products
              </p>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              isEmpty={isEmpty}
              onAddToCart={(product) => addToCart(product as any, 1)}
            />

            {/* Pagination */}
            {!isEmpty && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <span className="text-muted-foreground">...</span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
