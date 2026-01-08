"use server"

import type { Variant, StockInfo } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

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

// Get product variants
export async function getProductVariants(productId: string) {
  return fetchFromAPI<Variant[]>(`/inventory/variants?productId=${productId}`)
}

// Get stock information
export async function getStockInfo(productId: string) {
  return fetchFromAPI<StockInfo>(`/inventory/stock/${productId}`)
}

// Reserve stock (for cart operations)
export async function reserveStock(productId: string, quantity: number) {
  return fetchFromAPI<{ reserved: boolean; expiresAt: string }>("/inventory/reserve", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  })
}

// Release stock reservation
export async function releaseStockReservation(productId: string, reservationId: string) {
  return fetchFromAPI<{ released: boolean }>(`/inventory/reserve/${reservationId}`, {
    method: "DELETE",
  })
}
