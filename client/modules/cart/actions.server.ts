"use server"

import type { CartItem } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

const MOCK_PRODUCT_STOCK: Record<string, number> = {
  "1": 45,
  "2": 18,
  "3": 22,
  "4": 67,
  "5": 156,
  "6": 89,
  "7": 34,
  "8": 123,
  "9": 41,
  "10": 78,
  "11": 92,
  "12": 64,
}

// Validate product stock on server with fallback to mock data
export async function validateStock(productId: string, quantity: number) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    const response = await fetch(`${API_BASE_URL}/catalog/products/${productId}/stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return {
        available: false,
        error: "Product is out of stock",
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Stock validation error:", error)
    const mockStock = MOCK_PRODUCT_STOCK[productId] || 10
    const available = mockStock >= quantity

    return {
      available,
      stock: mockStock,
      error: available ? null : "Product out of stock",
    }
  }
}

// Calculate cart totals on server
export async function calculateCartTotals(items: CartItem[]) {
  try {
    // In production, this would be an API call for tax calculation, shipping rates, etc.
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.08 // 8% tax rate
    const shipping = items.length > 0 ? 10 : 0 // $10 flat shipping or free over $50

    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
    }
  } catch (error) {
    console.error("[v0] Cart calculation error:", error)
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      error: "Failed to calculate totals",
    }
  }
}
