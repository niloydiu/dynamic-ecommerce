import { Badge } from "@/components/ui/badge"

interface StockBadgeProps {
  inStock: boolean
  count?: number
  variant?: "default" | "compact"
}

export function StockBadge({ inStock, count = 0, variant = "default" }: StockBadgeProps) {
  if (!inStock) {
    return (
      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
        Out of Stock
      </Badge>
    )
  }

  if (variant === "compact") {
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
      >
        In Stock
      </Badge>
    )
  }

  const lowStock = count > 0 && count <= 5

  return (
    <Badge
      variant="outline"
      className={
        lowStock
          ? "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700"
          : "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
      }
    >
      {lowStock ? `Only ${count} left` : "In Stock"}
    </Badge>
  )
}
