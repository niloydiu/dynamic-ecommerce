import { ProductForm } from "@/modules/admin/components/product-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Create Product - Admin - NexusCommerce",
  description: "Create a new product",
}

export default function NewProductPage() {
  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Product</h1>
        </div>

        {/* Form */}
        <ProductForm redirectTo="/admin/products" />
      </div>
    </div>
  )
}
