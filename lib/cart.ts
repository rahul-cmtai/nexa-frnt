// Cart utilities and types
export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  size: string
  firmness: string
  quantity: number
  maxQuantity?: number
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

// Cart storage key
const CART_KEY = "nexa_rest_cart"

export const cartService = {
  // Get cart from localStorage
  getCart(): CartItem[] {
    if (typeof window === "undefined") return []
    const cart = localStorage.getItem(CART_KEY)
    return cart ? JSON.parse(cart) : []
  },

  // Save cart to localStorage
  saveCart(items: CartItem[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  },

  // Add item to cart
  addItem(item: Omit<CartItem, "quantity">, quantity = 1): CartItem[] {
    const items = this.getCart()
    const existingItemIndex = items.findIndex(
      (i) => i.id === item.id && i.size === item.size && i.firmness === item.firmness,
    )

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      items[existingItemIndex].quantity += quantity
      if (item.maxQuantity && items[existingItemIndex].quantity > item.maxQuantity) {
        items[existingItemIndex].quantity = item.maxQuantity
      }
    } else {
      // Add new item
      items.push({ ...item, quantity })
    }

    this.saveCart(items)
    return items
  },

  // Update item quantity
  updateQuantity(id: string, size: string, firmness: string, quantity: number): CartItem[] {
    const items = this.getCart()
    const itemIndex = items.findIndex((i) => i.id === id && i.size === size && i.firmness === firmness)

    if (itemIndex > -1) {
      if (quantity <= 0) {
        items.splice(itemIndex, 1)
      } else {
        items[itemIndex].quantity = quantity
      }
    }

    this.saveCart(items)
    return items
  },

  // Remove item from cart
  removeItem(id: string, size: string, firmness: string): CartItem[] {
    const items = this.getCart().filter((i) => !(i.id === id && i.size === size && i.firmness === firmness))
    this.saveCart(items)
    return items
  },

  // Clear cart
  clearCart(): void {
    this.saveCart([])
  },

  // Calculate totals
  calculateTotals(items: CartItem[]): { total: number; itemCount: number } {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return { total, itemCount }
  },
}
