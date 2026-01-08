"use client";

import { useCallback } from "react";
import { useCartStore } from "./store";
import { validateStock } from "./actions.server";
import { reserveStock } from "../inventory/actions.server";
import { useInventoryStore } from "../inventory/store";
import type { CartItem } from "./types";

// Simple UUID generator for client-side use
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useCart() {
  const store = useCartStore();

  return {
    items: store.items,
    subtotal: store.subtotal,
    tax: store.tax,
    shipping: store.shipping,
    total: store.total,
    itemCount: store.itemCount,
    isLoading: store.isLoading,
    error: store.error,
  };
}

export function useAddToCart() {
  const addToCart = useCallback(
    async (
      product: {
        id: string;
        name: string;
        price: number;
        originalPrice?: number;
        image: string;
      },
      quantity: number
    ) => {
      const store = useCartStore.getState();
      const inventoryStore = useInventoryStore.getState();

      const stockValidation = await validateStock(product.id, quantity);

      if (stockValidation.available === false) {
        store.setError("Product is out of stock or insufficient quantity");
        return { success: false, error: stockValidation.error };
      }

      // Create cart item
      const cartItem: CartItem = {
        id: generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity,
      };

      // Optimistic update
      store.addItem(cartItem);
      store.setError(null);

      // Try to reserve stock on the server (or mock). If reservation fails, revert.
      try {
        const res = await reserveStock(product.id, quantity);

        if (res.error || !res.data || res.data.reserved !== true) {
          // Revert optimistic add
          const existing = store.items.find(
            (it) => it.productId === product.id && it.quantity === quantity
          );
          if (existing) {
            store.removeItem(existing.id);
          }

          const message = res.error
            ? res.error.message || "Failed to reserve stock"
            : "Unable to reserve stock";
          store.setError(message as any);
          return { success: false, error: message };
        }

        // Reservation succeeded — update inventory store if stock info exists
        const current = inventoryStore.getStockInfo(product.id);
        if (current && typeof current.stock === "number") {
          inventoryStore.setStockInfo(product.id, {
            ...current,
            stock: Math.max(0, current.stock - quantity),
            available: Math.max(0, current.stock - quantity) > 0,
          });
        }

        return { success: true };
      } catch (err) {
        // Revert optimistic add
        const existing = store.items.find(
          (it) => it.productId === product.id && it.quantity === quantity
        );
        if (existing) {
          store.removeItem(existing.id);
        }

        store.setError("Failed to reserve stock");
        return { success: false, error: err };
      }
    },
    []
  );

  return { addToCart };
}

export function useRemoveFromCart() {
  const store = useCartStore();

  const removeFromCart = useCallback(
    (itemId: string) => {
      store.removeItem(itemId);
    },
    [store]
  );

  return { removeFromCart };
}

export function useUpdateCartQuantity() {
  const store = useCartStore();

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return;

      // Update optimistically
      store.updateQuantity(itemId, quantity);
    },
    [store]
  );

  return { updateQuantity };
}

export function useClearCart() {
  const store = useCartStore();

  const clearCart = useCallback(() => {
    store.clearCart();
  }, [store]);

  return { clearCart };
}
