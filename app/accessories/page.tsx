"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Star, Heart, Filter, Loader2, AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  images: string[]
  badge?: string
  features: string[]
  sizes: string[]
  firmness: string[]
  stock: number
  type: string
  category: string
  gender: string
  description: string
  specifications: any
  adminPackagingDimension: {
    length: number
  }
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  statusCode: number
  data: {
    products: Product[]
  }
}

// Improved deep-parse helper for nested stringified arrays
const deepParseArray = (arr: any[]): string[] => {
  if (!Array.isArray(arr)) return []
  
  return arr
    .flatMap((item) => {
      let current: any = item
      // Parse up to 5 levels deep to handle deeply nested JSON
      for (let i = 0; i < 5; i++) {
        if (typeof current === "string") {
          try {
            current = JSON.parse(current)
          } catch {
            break
          }
        } else {
          break
        }
      }
      return Array.isArray(current) ? current : [current]
    })
    .filter((item) => item && typeof item === "string" && item.trim() !== "")
}

export default function AccessoriesPage() {
  const { addItem } = useCart()
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist()
  const router = useRouter()

  const [priceRange, setPriceRange] = useState<number[]>([0, 20000])
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalProducts, setTotalProducts] = useState<number>(0)

  const resolveImageSrc = (img: string): string => {
    if (!img) return "/placeholder.svg"
    if (/^https?:\/\//.test(img)) return img
    const path = img.startsWith("/") ? img : `/${img}`
    return `${API_BASE}${path}`
  }

  const fetchProducts = async (page: number = 1): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      // Build query parameters for API filtering
      const params = new URLSearchParams()
      params.append('category', 'Accessories')
      params.append('page', page.toString())
      params.append('limit', '12')
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }
      
      if (selectedType !== 'all') {
        params.append('type', selectedType)
      }

      const response = await fetch(`${API_BASE}/api/v1/products?${params.toString()}`)
      if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`)
      const data: any = await response.json()

      let productsArray: Product[] = []
      if (data.statusCode === 200 && Array.isArray(data.data?.products)) {
        productsArray = data.data.products.map((p: any) => ({
          ...p,
          features: deepParseArray(p.features || []),
          sizes: deepParseArray(p.sizes || []),
          firmness: deepParseArray(p.firmness || []),
        }))
        
        setTotalPages(data.data.totalPages || 1)
        setTotalProducts(data.data.totalProducts || productsArray.length)
        setCurrentPage(data.data.currentPage || page)
      } else {
        throw new Error("Invalid API response structure")
      }

      setProducts(productsArray)
      setAllProducts(productsArray)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load products"
      setError(errorMessage)
      setProducts([])
      setAllProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage)
  }, [searchQuery, selectedType])

  useEffect(() => {
    fetchProducts(1)
  }, [])

  // Client-side filtering for additional filters (price, size)
  const filteredProducts = products
    .filter((product: Product) => {
      const price = product.price || 0
      
      // Price range filter (client-side)
      const priceInRange = price >= priceRange[0] && price <= priceRange[1]
      
      // Size filter (client-side)
      const sizeMatch = 
        selectedSize === "all" || 
        (Array.isArray(product.sizes) && product.sizes.includes(selectedSize))
      
      return priceInRange && sizeMatch
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return b.reviews - a.reviews
      }
    })

  // Extract unique values from all products for filters
  const uniqueTypes = [...new Set(allProducts.map((p: Product) => p.type).filter(Boolean))]
  const uniqueSizes = [
    ...new Set(allProducts.flatMap((p: Product) => p.sizes || []).filter(Boolean)),
  ]

  const handlePriceRangeChange = (value: number[]) => setPriceRange(value)
  const handleClearFilters = () => {
    setPriceRange([0, 20000])
    setSelectedType("all")
    setSelectedSize("all")
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchProducts(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Debug logs - you can remove these in production
  console.log("products", products)
  console.log("filteredProducts", filteredProducts)
  console.log("selectedType", selectedType)
  console.log("selectedSize", selectedSize)
  console.log("uniqueTypes", uniqueTypes)
  console.log("uniqueSizes", uniqueSizes)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Sleep Accessories</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty mb-6">
            Complete your sleep sanctuary with our premium accessories. From weighted blankets to luxury bedsheets,
            every item is designed to enhance your sleep experience.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search accessories by name, material, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-6 text-base"
              />
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-1/4">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Filters</h2>
              </div>
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={20000}
                  min={0}
                  step={1000}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-medium mb-3">Type</h3>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-6">
                <h3 className="font-medium mb-3">Size</h3>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {uniqueSizes.map((size: string) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="w-full" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {loading ? "Loading..." : `Showing ${filteredProducts.length} of ${products.length} products`}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                <span className="text-lg">Loading products...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-12">
                <Card className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Error Loading Products</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => fetchProducts(currentPage)}>Try Again</Button>
                </Card>
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or check back later for new products.
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product: Product) => {
                  const productId = product._id
                  const productPrice = product.price
                  const productOriginalPrice = product.originalPrice || productPrice
                  const productImage = resolveImageSrc(product.images?.[0] || "")
                  const productRating = product.rating || 0
                  const productReviews = product.reviews || 0
                  const productFeatures = product.features || []
                  const discountPercentage =
                    productOriginalPrice > productPrice
                      ? Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100)
                      : 0

                  return (
                    <Card
                      key={productId}
                      className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          src={productImage}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badge && (
                          <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                            {product.badge}
                          </Badge>
                        )}
                        <button
                          type="button"
                          className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white transition"
                          onClick={() => {
                            if (isInWishlist(productId)) {
                              removeWishlistItem(productId)
                            } else {
                              addWishlistItem({
                                id: productId,
                                name: product.name,
                                price: productPrice,
                                originalPrice: productOriginalPrice,
                                image: productImage,
                                category: product.category,
                                rating: productRating,
                                reviews: productReviews,
                                inStock: product.stock > 0,
                              })
                            }
                          }}
                        >
                          <Heart
                            className={`w-4 h-4 ${isInWishlist(productId) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </button>
                      </div>

                      <CardContent className="p-6">
                        <h3 className="font-playfair text-xl font-bold mb-2 line-clamp-2">{product.name}</h3>

                        {productRating > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(productRating) ? "fill-secondary text-secondary" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {productRating} ({productReviews} reviews)
                            </span>
                          </div>
                        )}

                        {productFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {productFeatures.slice(0, 3).map((feature: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              ₹{productPrice.toLocaleString()}
                            </span>
                            {discountPercentage > 0 && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{productOriginalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {discountPercentage > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {discountPercentage}% OFF
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button asChild className="flex-1">
                            <Link href={`/accessories/${productId}`}>View Details</Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            disabled={product.stock === 0}
                            onClick={() => {
                              const defaultSize = product.sizes?.[0] || ""
                              const defaultFirmness = product.firmness?.[0] || ""
                              addItem(
                                {
                                  id: productId,
                                  name: product.name,
                                  price: productPrice,
                                  originalPrice: productOriginalPrice,
                                  image: productImage,
                                  size: defaultSize,
                                  firmness: defaultFirmness,
                                },
                                1,
                              )
                              router.push("/cart")
                            }}
                          >
                            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}