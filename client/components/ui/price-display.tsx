import { formatPrice } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  className?: string
  variant?: "default" | "large" | "small"
}

export function PriceDisplay({ price, originalPrice, className, variant = "default" }: PriceDisplayProps) {
  const sizeClasses = {
    small: "text-sm font-semibold",
    default: "text-lg font-bold",
    large: "text-2xl font-bold",
  }

  const hasDiscount = originalPrice && originalPrice > price
  const discount = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className={sizeClasses[variant]}>{formatPrice(price)}</span>
        {hasDiscount && (
          <>
            <span className="line-through text-muted-foreground text-sm">{formatPrice(originalPrice)}</span>
            <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-md font-semibold">
              -{discount}%
            </span>
          </>
        )}
      </div>
    </div>
  )
}
