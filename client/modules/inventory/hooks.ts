"use client"

import { useCallback } from "react"
import { useInventoryStore } from "./store"
import { getStockInfo as getStockInfoAction, getProductVariants } from "./actions.server"

export function useStockInfo(productId: string) {
  const store = useInventoryStore()

  const fetchStockInfo = useCallback(async () => {
    store.setIsLoading(true)
    const result = await getStockInfoAction(productId)

    if (result.error) {
      store.setError(result.error.message)
    } else if (result.data) {
      store.setStockInfo(productId, result.data)
      store.setError(null)
    }

    store.setIsLoading(false)
  }, [productId, store])

  return {
    stockInfo: store.getStockInfo(productId),
    isLoading: store.isLoading,
    error: store.error,
    fetchStockInfo,
  }
}

export function useProductVariants(productId: string) {
  const store = useInventoryStore()

  const fetchVariants = useCallback(async () => {
    store.setIsLoading(true)
    const result = await getProductVariants(productId)

    if (result.error) {
      store.setError(result.error.message)
    } else if (result.data) {
      store.setError(null)
    }

    store.setIsLoading(false)

    return result
  }, [productId, store])

  return {
    isLoading: store.isLoading,
    error: store.error,
    fetchVariants,
  }
}
