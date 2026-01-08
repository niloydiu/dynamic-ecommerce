export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  variants?: Record<string, string>
  stock?: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
  updatedAt: string
}

export interface CartError {
  code: string
  message: string
}
