import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductRatingProps {
  rating: number
  reviewCount?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
}

export function ProductRating({ rating, reviewCount = 0, size = "md", showCount = true }: ProductRatingProps) {
  const clampedRating = Math.min(Math.max(rating, 0), 5)
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {stars.map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= clampedRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
            )}
          />
        ))}
      </div>
      {showCount && (
        <span className={cn(textSizes[size], "text-muted-foreground")}>
          {clampedRating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  )
}
