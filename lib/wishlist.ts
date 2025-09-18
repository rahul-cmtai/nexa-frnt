// Wishlist utilities and types
export interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category?: string
  rating?: number
  reviews?: number
  inStock?: boolean
}

export interface WishlistState {
  items: WishlistItem[]
  itemCount: number
}

const WISHLIST_KEY = "nexa_rest_wishlist"

export const wishlistService = {
  getWishlist(): WishlistItem[] {
    if (typeof window === "undefined") return []
    const raw = localStorage.getItem(WISHLIST_KEY)
    return raw ? (JSON.parse(raw) as WishlistItem[]) : []
  },

  saveWishlist(items: WishlistItem[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  },

  addItem(item: WishlistItem): WishlistItem[] {
    const items = this.getWishlist()
    const exists = items.some((i) => i.id === item.id)
    if (!exists) {
      items.unshift(item)
    }
    this.saveWishlist(items)
    return items
  },

  removeItem(id: string): WishlistItem[] {
    const items = this.getWishlist().filter((i) => i.id !== id)
    this.saveWishlist(items)
    return items
  },

  clear(): void {
    this.saveWishlist([])
  },
}


