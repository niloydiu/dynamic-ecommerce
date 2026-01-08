export interface Variant {
  id: string
  name: string
  options: VariantOption[]
}

export interface VariantOption {
  id: string
  name: string
  value: string
  inStock: boolean
  stock: number
}

export interface StockInfo {
  productId: string
  inStock: boolean
  totalStock: number
  lowStock: boolean
  reorderLevel: number
}

export interface InventoryError {
  code: string
  message: string
}
