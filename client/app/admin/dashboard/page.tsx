import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Package, Layers, BarChart3, Settings } from "lucide-react"

export const metadata = {
  title: "Admin Dashboard - NexusCommerce",
  description: "Manage products, inventory, and store settings",
}

export default function AdminDashboard() {
  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store and inventory</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/products/new">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Package className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-sm">Add Product</h3>
              <p className="text-xs text-muted-foreground mt-1">Create new product</p>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Layers className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-sm">Manage Products</h3>
              <p className="text-xs text-muted-foreground mt-1">View and edit products</p>
            </Card>
          </Link>

          <Link href="/admin/inventory">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <BarChart3 className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-sm">Inventory</h3>
              <p className="text-xs text-muted-foreground mt-1">Track stock levels</p>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Settings className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-sm">Settings</h3>
              <p className="text-xs text-muted-foreground mt-1">Store configuration</p>
            </Card>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-muted-foreground text-sm font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold">-</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting API integration</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-muted-foreground text-sm font-semibold mb-2">Low Stock Items</h3>
            <p className="text-3xl font-bold">-</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting API integration</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-muted-foreground text-sm font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">-</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting API integration</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
