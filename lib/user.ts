// User API client aligned with Express routes

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ""

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("auth_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, method: HttpMethod = "GET", body?: any): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  Object.assign(headers, getAuthHeaders())

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data?.message || data?.error || res.statusText
    throw new Error(message)
  }
  return (data?.data ?? data) as T
}

export interface DashboardStats {
  pendingOrders: number
  wishlistItems: number
  cartItems: number
  savedAddresses: number
}

export interface RecentOrderItem {
  orderId: string
  date: string
  total: number
  status: string
}

export const userApi = {
  // Dashboard
  getDashboardStats: () => request<DashboardStats>("/users/dashboard/stats", "GET"),
  getRecentOrders: () => request<RecentOrderItem[]>("/users/orders/recent", "GET"),

  // Profile
  getMyProfile: () => request<any>("/users/profile", "GET"),
  updateMyProfile: (payload: { name: string }) => request<any>("/users/profile", "PATCH", payload),

  // Addresses
  getAddresses: () => request<any[]>("/users/address", "GET"),
  addAddress: (payload: any) => request<any[]>("/users/address", "POST", payload),
  updateAddress: (addressId: string, payload: any) => request<any[]>(`/users/address/${addressId}`, "PATCH", payload),
  deleteAddress: (addressId: string) => request<any[]>(`/users/address/${addressId}`, "DELETE"),

  // Wishlist
  getWishlist: () => request<any[]>("/users/wishlist", "GET"),
  addToWishlist: (productId: string) => request<any[]>("/users/wishlist", "POST", { productId }),
  removeFromWishlist: (productId: string) => request<any[]>(`/users/wishlist/${productId}`, "DELETE"),

  // Cart
  getCart: () => request<any[]>("/users/cart", "GET"),
  addToCart: (productId: string, quantity = 1) => request<any[]>("/users/cart", "POST", { productId, quantity }),
  removeFromCart: (cartItemId: string) => request<any[]>(`/users/cart/${cartItemId}`, "DELETE"),
  updateCartQuantity: (productId: string, quantity: number) => request<any[]>(`/users/cart/quantity/${productId}`, "PATCH", { quantity }),

  // Orders
  placeOrder: (addressId: string) => request<any>("/users/orders", "POST", { addressId }),
  getMyOrders: () => request<any[]>("/users/orders", "GET"),
  getSingleOrder: (orderId: string) => request<any>(`/users/orders/${orderId}`, "GET"),
}


