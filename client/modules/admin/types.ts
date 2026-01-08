export interface AdminUser extends Record<string, any> {
  id: string
  email: string
  role: "admin" | "moderator"
  permissions: string[]
}

export interface ProductFormData {
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  images?: string[]
  inStock: boolean
  stock: number
  tags?: string[]
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
  image?: string
}

export interface AdminError {
  code: string
  message: string
}
