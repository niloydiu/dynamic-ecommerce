"use client"

import { useEffect, useState } from "react"
import { useCatalog, useFilters } from "@/modules/catalog/hooks"
import { FilterSidebar } from "@/modules/catalog/components/filter-sidebar"
import { ProductGrid } from "@/modules/catalog/components/product-grid"
import { SortDropdown } from "@/modules/catalog/components/sort-dropdown"
import { SearchBar } from "@/modules/catalog/components/search-bar"
import { getCategories } from "@/modules/catalog/actions.server"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CatalogFilters } from "@/modules/catalog/types"

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
  } = useCatalog()
  const { resetFilters } = useFilters()
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  // Load categories on mount
  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories()
      if (result.data) {
        setCategories(result.data)
      }
      setIsLoadingCategories(false)
    }
    loadCategories()
  }, [setCategories])

  // Load products when filters change
  useEffect(() => {
    fetchProducts()
  }, [filters, fetchProducts])

  const handleCategoryChange = (category: string | undefined) => {
    updateFilters({ category, page: 1 })
  }

  const handlePriceChange = (range: [number, number]) => {
    updateFilters({ minPrice: range[0], maxPrice: range[1], page: 1 })
  }

  const handleSortChange = (sortBy: CatalogFilters["sortBy"]) => {
    updateFilters({ sortBy })
  }

  const handleSearch = (query: string) => {
    updateFilters({ search: query, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const totalPages = Math.ceil(totalProducts / (filters.limit || 12))
  const isEmpty = !isLoading && products.length === 0

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shop Our Collection</h1>
          <p className="text-muted-foreground">Browse our curated selection of premium products</p>
        </div>

        {/* Main Content */}
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              selectedCategory={filters.category}
              priceRange={[filters.minPrice || 0, filters.maxPrice || 1000]}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onReset={() => {
                resetFilters()
                updateFilters({ page: 1 })
              }}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1 space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <SortDropdown value={filters.sortBy} onChange={handleSortChange} />
            </div>

            {/* Results Count */}
            {!isEmpty && (
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * (filters.limit || 12) + 1} to{" "}
                {Math.min(currentPage * (filters.limit || 12), totalProducts)} of {totalProducts} products
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
            <ProductGrid products={products} isLoading={isLoading} isEmpty={isEmpty} />

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
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && <span className="text-muted-foreground">...</span>}
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
  )
}
