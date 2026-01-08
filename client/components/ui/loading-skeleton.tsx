import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ProductCardSkeletonProps {
  className?: string
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("rounded-lg border border-border overflow-hidden space-y-3 p-3", className)}>
      <Skeleton className="w-full h-64 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex justify-between pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

interface ProductGridSkeletonProps {
  count?: number
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function ProductGridSkeleton({ count = 6, columns = 3, className }: ProductGridSkeletonProps) {
  const gridColsClass = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={cn(`grid gap-6 grid-cols-1 ${gridColsClass[columns]}`, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
