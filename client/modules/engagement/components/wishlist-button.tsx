"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useWishlist } from "../hooks"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  userId?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function WishlistButton({ productId, userId, size = "md", showText = false }: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist(userId)
  const isWishlisted = isInWishlist(productId)

  const handleToggle = async () => {
    if (isWishlisted) {
      const items = await Promise.resolve()
      // In real implementation, we'd track item IDs
    } else {
      await addToWishlist(productId)
    }
  }

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(sizeClasses[size], isWishlisted && "text-red-500")}
      onClick={handleToggle}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn(iconSizes[size], isWishlisted && "fill-current")} />
      {showText && <span className="ml-2 text-sm">{isWishlisted ? "Wishlisted" : "Wishlist"}</span>}
    </Button>
  )
}
