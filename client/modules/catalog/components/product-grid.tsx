import { ProductCard } from "./product-card"
import { ProductGridSkeleton } from "@/components/ui/loading-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Package } from "lucide-react"
import type { Product } from "../types"

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  isEmpty?: boolean
  onAddToCart?: (product: Product) => void
}

export function ProductGrid({ products, isLoading = false, isEmpty = false, onAddToCart }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={12} columns={3} />
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={Package}
        title="No products found"
        description="Try adjusting your filters or search terms"
        action={{
          label: "Browse all products",
          href: "/catalog",
        }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
