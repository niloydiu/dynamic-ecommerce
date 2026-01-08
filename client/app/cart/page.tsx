"use client"

import { useCart } from "@/modules/cart/hooks"
import { CartItem } from "@/modules/cart/components/cart-item"
import { CartSummary } from "@/modules/cart/components/cart-summary"
import { EmptyState } from "@/components/ui/empty-state"
import { ShoppingCart } from "lucide-react"

export default function CartPage() {
  const { items, subtotal, tax, shipping, total, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add some items to your cart to get started"
            action={{
              label: "Start Shopping",
              href: "/catalog",
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{itemCount} item(s) in your cart</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-lg border border-border p-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <CartSummary subtotal={subtotal} tax={tax} shipping={shipping} total={total} itemCount={itemCount} />
          </div>
        </div>
      </div>
    </div>
  )
}
