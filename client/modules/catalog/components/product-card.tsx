"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PriceDisplay } from "@/components/ui/price-display"
import { StockBadge } from "@/components/ui/stock-badge"
import { ProductRating } from "@/components/ui/product-rating"
import { Heart } from "lucide-react"
import type { Product } from "../types"
import { useInventoryStore } from "@/modules/inventory/store"
import { useEffect } from "react"
import { useStockInfo } from "@/modules/inventory/hooks"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const stockInfo = useInventoryStore((s) => s.stockInfo[product.id] || null)
  const inStock = stockInfo ? !!stockInfo.available : product.inStock
  const stockCount = stockInfo?.stock ?? product.stock

  // Ensure we fetch live stock info for this product so the badge updates
  const { fetchStockInfo } = useStockInfo(product.id)
  useEffect(() => {
    // Fetch once on mount
    fetchStockInfo().catch(() => {})
  }, [fetchStockInfo])
  return (
    <Link href={`/catalog/${product.slug}`}>
      <div className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 group cursor-pointer flex flex-col h-full">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-muted overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=400&width=400&query=product"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Discount Badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-xs font-semibold">
              Sale
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="absolute top-3 left-3 p-2 bg-background rounded-full hover:bg-muted transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Stock Badge */}
          <div className="absolute bottom-3 left-3">
            <StockBadge inStock={inStock} count={stockCount} variant="compact" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          {/* Category */}
          <span className="text-xs font-semibold text-primary uppercase">{product.category}</span>

          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating !== undefined && (
            <ProductRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>

          {/* Price & Button */}
          <div className="pt-3 border-t border-border space-y-3">
            <PriceDisplay price={product.price} originalPrice={product.originalPrice} />
            <Button
              size="sm"
              className="w-full"
              disabled={!inStock}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart?.(product)
              }}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
