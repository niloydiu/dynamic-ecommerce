"use server"

import type { Product, Category, ProductListResponse, CatalogFilters, CatalogError } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    originalPrice: 249.99,
    image: "/wireless-headphones.jpg",
    category: "electronics",
    inStock: true,
    stock: 45,
    rating: 4.8,
    reviewCount: 234,
    tags: ["audio", "wireless", "premium"],
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    description: "Comfortable and stylish office chair with adjustable lumbar support and breathable mesh.",
    price: 349.99,
    image: "/office-chair.jpg",
    category: "furniture",
    inStock: true,
    stock: 18,
    rating: 4.6,
    reviewCount: 128,
    tags: ["office", "furniture", "ergonomic"],
  },
  {
    id: "3",
    name: "4K Portable Monitor",
    slug: "4k-portable-monitor",
    description: "Ultra-thin 4K monitor perfect for professionals and remote workers. 15.6-inch display.",
    price: 449.99,
    originalPrice: 549.99,
    image: "/portable-monitor.jpg",
    category: "electronics",
    inStock: true,
    stock: 22,
    rating: 4.7,
    reviewCount: 189,
    tags: ["monitor", "4k", "portable"],
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    slug: "mechanical-keyboard",
    description: "RGB mechanical keyboard with custom switches and customizable macros.",
    price: 149.99,
    image: "/mechanical-keyboard.png",
    category: "electronics",
    inStock: true,
    stock: 67,
    rating: 4.9,
    reviewCount: 412,
    tags: ["keyboard", "gaming", "mechanical"],
  },
  {
    id: "5",
    name: "Smartphone Stand",
    slug: "smartphone-stand",
    description: "Adjustable aluminum smartphone stand compatible with all devices.",
    price: 29.99,
    image: "/minimalist-wooden-phone-stand.png",
    category: "accessories",
    inStock: true,
    stock: 156,
    rating: 4.5,
    reviewCount: 67,
    tags: ["accessories", "smartphone", "stand"],
  },
  {
    id: "6",
    name: "Wireless Mouse",
    slug: "wireless-mouse",
    description: "Precision wireless mouse with ergonomic design and fast charging.",
    price: 79.99,
    originalPrice: 99.99,
    image: "/wireless-mouse.jpg",
    category: "electronics",
    inStock: true,
    stock: 89,
    rating: 4.7,
    reviewCount: 245,
    tags: ["mouse", "wireless", "ergonomic"],
  },
  {
    id: "7",
    name: "Desk Lamp Pro",
    slug: "desk-lamp-pro",
    description: "LED desk lamp with adjustable brightness and color temperature.",
    price: 89.99,
    image: "/desk-lamp.jpg",
    category: "lighting",
    inStock: true,
    stock: 34,
    rating: 4.6,
    reviewCount: 156,
    tags: ["lighting", "office", "led"],
  },
  {
    id: "8",
    name: "USB-C Hub",
    slug: "usb-c-hub",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.",
    price: 59.99,
    image: "/usb-hub.png",
    category: "accessories",
    inStock: true,
    stock: 123,
    rating: 4.4,
    reviewCount: 98,
    tags: ["usb-c", "hub", "accessories"],
  },
  {
    id: "9",
    name: "Webcam HD",
    slug: "webcam-hd",
    description: "1080p HD webcam with built-in microphone and auto-focus.",
    price: 119.99,
    image: "/classic-webcam.png",
    category: "electronics",
    inStock: true,
    stock: 41,
    rating: 4.5,
    reviewCount: 187,
    tags: ["webcam", "video", "recording"],
  },
  {
    id: "10",
    name: "Laptop Stand",
    slug: "laptop-stand",
    description: "Adjustable aluminum laptop stand for improved ergonomics.",
    price: 49.99,
    image: "/laptop-stand.jpg",
    category: "accessories",
    inStock: true,
    stock: 78,
    rating: 4.6,
    reviewCount: 134,
    tags: ["laptop", "stand", "accessories"],
  },
  {
    id: "11",
    name: "Noise-Canceling Earbuds",
    slug: "noise-canceling-earbuds",
    description: "Compact earbuds with active noise cancellation and 8-hour battery.",
    price: 129.99,
    originalPrice: 179.99,
    image: "/wireless-mouse.jpg",
    category: "electronics",
    inStock: true,
    stock: 92,
    rating: 4.7,
    reviewCount: 356,
    tags: ["audio", "earbuds", "noise-canceling"],
  },
  {
    id: "12",
    name: "Desk Organizer",
    slug: "desk-organizer",
    description: "Multi-compartment desk organizer for better workspace organization.",
    price: 39.99,
    image: "/desk-organizer.jpg",
    category: "office",
    inStock: true,
    stock: 64,
    rating: 4.3,
    reviewCount: 82,
    tags: ["office", "organizer", "desk"],
  },
]

const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Tech gadgets and devices",
    productCount: 6,
  },
  {
    id: "2",
    name: "Furniture",
    slug: "furniture",
    description: "Office and home furniture",
    productCount: 1,
  },
  {
    id: "3",
    name: "Accessories",
    slug: "accessories",
    description: "Tech accessories and add-ons",
    productCount: 4,
  },
  {
    id: "4",
    name: "Lighting",
    slug: "lighting",
    description: "Desk and ambient lighting",
    productCount: 1,
  },
  {
    id: "5",
    name: "Office",
    slug: "office",
    description: "Office supplies and organizers",
    productCount: 1,
  },
]

async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<{ data?: T; error?: CatalogError; usedMockData?: boolean }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      signal: controller.signal,
      ...options,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json()
      return {
        error: {
          code: error.code || "UNKNOWN_ERROR",
          message: error.message || "An error occurred while fetching data",
        },
      }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error(`[v0] API Error at ${endpoint}:`, error)
    return {
      error: {
        code: "NETWORK_ERROR",
        message: "Using mock data - Backend server is not available. Connect a backend to see real data.",
      },
      usedMockData: true,
    }
  }
}

// Get all products with filters and pagination
export async function getProducts(filters: CatalogFilters = {}) {
  const { category, search, minPrice = 0, maxPrice = 1000, sortBy = "newest", page = 1, limit = 12 } = filters

  const apiResult = await fetchFromAPI<ProductListResponse>("/catalog/products")

  let products = apiResult.data?.products || MOCK_PRODUCTS

  // Apply client-side filtering if using mock data or for consistency
  if (category) {
    products = products.filter((p) => p.category === category)
  }

  if (search) {
    const query = search.toLowerCase()
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  products = products.filter((p) => p.price >= minPrice && p.price <= maxPrice)

  // Sort
  switch (sortBy) {
    case "price-low":
      products.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      products.sort((a, b) => b.price - a.price)
      break
    case "popular":
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case "newest":
    default:
      products.reverse()
  }

  // Paginate
  const total = products.length
  const startIndex = (page - 1) * limit
  const paginatedProducts = products.slice(startIndex, startIndex + limit)

  return {
    data: {
      products: paginatedProducts,
      total,
      page,
      limit,
      hasMore: startIndex + limit < total,
    },
    usedMockData: apiResult.usedMockData,
  }
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  if (!slug || typeof slug !== "string") {
    return {
      error: {
        code: "INVALID_INPUT",
        message: "Product slug is required",
      },
    }
  }

  const apiResult = await fetchFromAPI<Product>(`/catalog/products/${slug}`)

  if (apiResult.usedMockData) {
    const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug)
    return {
      data: mockProduct,
      usedMockData: true,
    }
  }

  return apiResult
}

// Get single product by ID
export async function getProductById(id: string) {
  if (!id || typeof id !== "string") {
    return {
      error: {
        code: "INVALID_INPUT",
        message: "Product ID is required",
      },
    }
  }

  const apiResult = await fetchFromAPI<Product>(`/catalog/products/id/${id}`)

  if (apiResult.usedMockData) {
    const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id)
    return {
      data: mockProduct,
      usedMockData: true,
    }
  }

  return apiResult
}

// Search products
export async function searchProducts(query: string, limit = 10) {
  if (!query || typeof query !== "string") {
    return {
      error: {
        code: "INVALID_INPUT",
        message: "Search query is required",
      },
    }
  }

  const q = query.toLowerCase()
  const results = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(q)),
  ).slice(0, limit)

  return {
    data: {
      products: results,
      total: results.length,
      page: 1,
      limit,
      hasMore: false,
    },
  }
}

// Get all categories
export async function getCategories() {
  return {
    data: MOCK_CATEGORIES,
  }
}

// Get single category by slug
export async function getCategoryBySlug(slug: string) {
  if (!slug || typeof slug !== "string") {
    return {
      error: {
        code: "INVALID_INPUT",
        message: "Category slug is required",
      },
    }
  }

  const category = MOCK_CATEGORIES.find((c) => c.slug === slug)
  return {
    data: category,
  }
}

// Validate product stock
export async function validateProductStock(productId: string, quantity: number) {
  if (!productId || !quantity || quantity < 1) {
    return {
      error: {
        code: "INVALID_INPUT",
        message: "Product ID and valid quantity are required",
      },
    }
  }

  const product = MOCK_PRODUCTS.find((p) => p.id === productId)
  const available = product ? (product.stock || 0) >= quantity : false

  return {
    data: {
      available,
      stock: product?.stock || 0,
    },
  }
}
