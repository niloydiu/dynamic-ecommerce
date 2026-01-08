"use client"

import { useCallback } from "react"
import { useInventoryStore } from "./store"
import { getStockInfo as getStockInfoAction, getProductVariants } from "./actions.server"

export function useStockInfo(productId: string) {
  const stockInfo = useInventoryStore((s) => s.stockInfo[productId] || null);
  const isLoading = useInventoryStore((s) => s.isLoading);
  const error = useInventoryStore((s) => s.error);

  const fetchStockInfo = useCallback(async () => {
    const store = useInventoryStore.getState();
    store.setIsLoading(true);
    const result = await getStockInfoAction(productId);

    if (result.error) {
      store.setError(result.error.message);
    } else if (result.data) {
      store.setStockInfo(productId, result.data);
      store.setError(null);
    }

    store.setIsLoading(false);
  }, [productId]);

  return {
    stockInfo,
    isLoading,
    error,
    fetchStockInfo,
  };
}

export function useProductVariants(productId: string) {
  const isLoading = useInventoryStore((s) => s.isLoading);
  const error = useInventoryStore((s) => s.error);

  const fetchVariants = useCallback(async () => {
    const store = useInventoryStore.getState();
    store.setIsLoading(true);
    const result = await getProductVariants(productId);

    if (result.error) {
      store.setError(result.error.message);
    } else {
      store.setError(null);
    }

    store.setIsLoading(false);

    return result;
  }, [productId]);

  return {
    isLoading,
    error,
    fetchVariants,
  };
}
