// Product and category types for the Catalog module

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  inStock: boolean
  stock?: number
  rating?: number
  reviewCount?: number
  variants?: ProductVariant[]
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ProductVariant {
  id: string
  name: string
  options: VariantOption[]
}

export interface VariantOption {
  id: string
  name: string
  value: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount?: number
}

export interface CatalogFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: "newest" | "price-low" | "price-high" | "popular"
  page?: number
  limit?: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface CatalogError {
  code: string
  message: string
}
