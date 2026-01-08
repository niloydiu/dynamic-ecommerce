"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { PriceDisplay } from "@/components/ui/price-display"
import { Trash2 } from "lucide-react"
import { useUpdateCartQuantity, useRemoveFromCart } from "../hooks"
import type { CartItem as CartItemType } from "../types"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity } = useUpdateCartQuantity()
  const { removeFromCart } = useRemoveFromCart()

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Product Image */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <Image
          src={item.image || "/placeholder.svg?height=96&width=96&query=product"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base line-clamp-2">{item.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">Product ID: {item.productId}</p>

        {/* Variants */}
        {item.variants && Object.keys(item.variants).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(item.variants).map(([key, value]) => (
              <span key={key} className="text-xs bg-muted px-2 py-1 rounded">
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <PriceDisplay price={item.price} originalPrice={item.originalPrice} variant="large" className="mt-2" />
      </div>

      {/* Quantity & Remove */}
      <div className="flex flex-col items-end gap-4">
        <QuantitySelector value={item.quantity} onChange={(qty) => updateQuantity(item.id, qty)} />

        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => removeFromCart(item.id)}
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
