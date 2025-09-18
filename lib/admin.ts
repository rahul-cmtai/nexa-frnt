// Admin utilities and mock data management
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  sizes: string[]
  firmness: string[]
  features: string[]
  inStock: boolean
  stockCount: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
  userEmail: string
  userName: string
  items: Array<{
    productId: string
    productName: string
    size: string
    firmness: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

// Storage keys
const PRODUCTS_KEY = "nexa_rest_products"
const ORDERS_KEY = "nexa_rest_orders"

export const adminService = {
  // Product Management
  getProducts(): Product[] {
    if (typeof window === "undefined") return []
    const products = localStorage.getItem(PRODUCTS_KEY)
    return products ? JSON.parse(products) : this.getDefaultProducts()
  },

  saveProducts(products: Product[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  },

  addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const products = this.getProducts()
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)
    this.saveProducts(products)
    return newProduct
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts()
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) return null

    products[productIndex] = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveProducts(products)
    return products[productIndex]
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts()
    const filteredProducts = products.filter((p) => p.id !== id)

    if (filteredProducts.length === products.length) return false

    this.saveProducts(filteredProducts)
    return true
  },

  // Order Management
  getOrders(): Order[] {
    if (typeof window === "undefined") return []
    const orders = localStorage.getItem(ORDERS_KEY)
    return orders ? JSON.parse(orders) : []
  },

  saveOrders(orders: Order[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  },

  updateOrderStatus(orderId: string, status: Order["status"]): Order | null {
    const orders = this.getOrders()
    const orderIndex = orders.findIndex((o) => o.id === orderId)

    if (orderIndex === -1) return null

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    this.saveOrders(orders)
    return orders[orderIndex]
  },

  // Analytics
  getAnalytics() {
    const orders = this.getOrders()
    const products = this.getProducts()

    const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, order) => sum + order.total, 0)

    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === "pending").length
    const totalProducts = products.length
    const outOfStockProducts = products.filter((p) => !p.inStock || p.stockCount === 0).length

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      outOfStockProducts,
      recentOrders: orders.slice(-5).reverse(),
    }
  },

  // Default products for demo
  getDefaultProducts(): Product[] {
    const defaultProducts: Product[] = [
      {
        id: "1",
        name: "Nexa Rest Premium Memory Foam",
        description: "Experience ultimate comfort with our premium memory foam mattress",
        price: 45000,
        originalPrice: 60000,
        images: ["/luxury-bedroom-with-premium-mattress--modern-minim.jpg"],
        category: "Memory Foam",
        sizes: ["Single", "Double", "Queen", "King"],
        firmness: ["Soft", "Medium", "Firm"],
        features: ["Memory Foam", "Cooling Gel", "10 Year Warranty", "Free Delivery"],
        inStock: true,
        stockCount: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Nexa Rest Hybrid Luxury",
        description: "Perfect blend of memory foam and pocket springs",
        price: 55000,
        originalPrice: 75000,
        images: ["/luxury-bedroom-with-premium-mattress--modern-minim.jpg"],
        category: "Hybrid",
        sizes: ["Single", "Double", "Queen", "King"],
        firmness: ["Medium", "Firm"],
        features: ["Hybrid Technology", "Edge Support", "10 Year Warranty", "Free Setup"],
        inStock: true,
        stockCount: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    this.saveProducts(defaultProducts)
    return defaultProducts
  },
}
