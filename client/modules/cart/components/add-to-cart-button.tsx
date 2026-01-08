"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { useAddToCart } from "../hooks"
import { Loader2 } from "lucide-react"
import type { Product } from "@/modules/catalog/types"

interface AddToCartButtonProps {
  product: Product
  variants?: Record<string, string>
  size?: "sm" | "md" | "lg"
  showQuantitySelector?: boolean
}

export function AddToCartButton({ product, variants, size = "md", showQuantitySelector = true }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [success, setSuccess] = useState(false)
  const { addToCart } = useAddToCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    const result = await addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
      },
      quantity,
    )

    if (result.success) {
      setSuccess(true)
      setQuantity(1)
      setTimeout(() => setSuccess(false), 2000)
    }

    setIsAdding(false)
  }

  const btnSize = (size === 'md' ? 'default' : size) as any

  if (showQuantitySelector) {
    return (
      <div className="space-y-3 w-full">
        <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock || 999} size={btnSize} />
        <Button size={btnSize} className="w-full" disabled={!product.inStock || isAdding} onClick={handleAddToCart}>
          {isAdding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : success ? (
            "Added to Cart!"
          ) : (
            "Add to Cart"
          )}
        </Button>
      </div>
    )
  }

  return (
    <Button size={btnSize} className="w-full" disabled={!product.inStock || isAdding} onClick={handleAddToCart}>
      {isAdding ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Adding...
        </>
      ) : success ? (
        "Added!"
      ) : (
        "Add to Cart"
      )}
    </Button>
  )
}
