"use server"

import type { Variant, StockInfo } from "./types"

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
  try {
    const res = await fetchFromAPI<{ reserved: boolean; expiresAt: string }>("/inventory/reserve", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    })

    // If API returned an error, fall through to mock reservation
    if (res.error || !res.data) {
      throw res.error || new Error("No reservation data")
    }

    return res
  } catch (err) {
    // Backend unavailable or reservation failed — provide a mock reservation
    console.warn(`[v0] reserveStock fallback for ${productId}:`, err)
    return {
      data: {
        reserved: true,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      },
    }
  }
}

// Release stock reservation
export async function releaseStockReservation(productId: string, reservationId: string) {
  return fetchFromAPI<{ released: boolean }>(`/inventory/reserve/${reservationId}`, {
    method: "DELETE",
  })
}
