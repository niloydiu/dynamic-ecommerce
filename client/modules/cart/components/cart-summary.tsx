import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

interface CartSummaryProps {
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
  isLoading?: boolean
}

export function CartSummary({ subtotal, tax, shipping, total, itemCount, isLoading = false }: CartSummaryProps) {
  return (
    <Card className="p-6 space-y-4 sticky top-24">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      {/* Line Items */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border pt-4" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="font-semibold">Total</span>
        <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button size="lg" className="w-full" disabled={isLoading || itemCount === 0}>
          Proceed to Checkout
        </Button>
      </Link>

      {/* Continue Shopping */}
      <Link href="/catalog">
        <Button size="lg" variant="outline" className="w-full bg-transparent">
          Continue Shopping
        </Button>
      </Link>
    </Card>
  )
}
