"use server"

import type { ProductFormData, CategoryFormData } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4000"

async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<{ data?: T; error?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json()
      return { error }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error(`[v0] API Error at ${endpoint}:`, error)
    return { error: { message: "Failed to connect to server" } }
  }
}

// Products - CRUD Operations
export async function createProduct(data: ProductFormData) {
  return fetchFromAPI("/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateProduct(id: string, data: Partial<ProductFormData>) {
  return fetchFromAPI(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: string) {
  return fetchFromAPI(`/admin/products/${id}`, {
    method: "DELETE",
  })
}

// Categories - CRUD Operations
export async function createCategory(data: CategoryFormData) {
  return fetchFromAPI("/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateCategory(id: string, data: Partial<CategoryFormData>) {
  return fetchFromAPI(`/admin/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteCategory(id: string) {
  return fetchFromAPI(`/admin/categories/${id}`, {
    method: "DELETE",
  })
}

// Inventory Management
export async function updateStock(productId: string, quantity: number) {
  return fetchFromAPI(`/admin/inventory/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ stock: quantity }),
  })
}

export async function getInventoryReport() {
  return fetchFromAPI("/admin/inventory/report")
}
