"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ArrowLeft, Plus, Minus, Loader2, AlertCircle, MessageCircle, Phone, Truck, Shield, RotateCcw, Award } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

interface Product {
  id?: string
  _id?: string
  name: string
  description?: string
  price?: number
  salePrice?: number
  originalPrice?: number
  rating?: number
  reviews?: number
  images?: string[]
  mainImage?: string
  badge?: string
  features?: string[]
  sizes?: Array<{ name?: string; price?: number; dimensions?: string }> | string[]
  type?: string
  specifications?: Record<string, any> | string
  category?: string
  stock?: number
}

const safeParseJson = (value: unknown): unknown => {
  if (typeof value !== "string") return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const flattenToStringArray = (input: unknown): string[] => {
  const result: string[] = []
  const walk = (val: unknown): void => {
    const maybeParsed = typeof val === "string" && (val.trim().startsWith("[") || val.trim().startsWith("{")) ? safeParseJson(val) : val
    if (Array.isArray(maybeParsed)) {
      for (const item of maybeParsed) walk(item)
    } else if (typeof maybeParsed === "string") { 
      const t = maybeParsed.trim()
      if (t) result.push(t)
    }
  }
  walk(input)
  return Array.from(new Set(result))
}

const resolveImageSrc = (img: any): string => {
  if (!img) return "/placeholder.svg"
  if (typeof img === "string") {
    if (/^https?:\/\//i.test(img)) return img
    const path = img.startsWith("/") ? img : `/${img}`
    return `${API_BASE}${path}`
  }
  if (typeof img === "object") return img?.secure_url || img?.url || img?.path || "/placeholder.svg"
  return "/placeholder.svg"
}

export default function ProtectorDetailPage(): JSX.Element {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [activeImage, setActiveImage] = useState<number>(0)

  useEffect(() => {
    const id = String(params.id)
    const fetchById = async (): Promise<void> => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/v1/products/${id}`)
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`)
        const body = await res.json()
        
        // Handle different API response structures
        const p: Product = body?.data?.product || body?.product || body?.data || body
        
        console.log("Raw API Response:", body) // Debug log
        console.log("Processed Product:", p) // Debug log
        
        // Process images
        const images = Array.isArray(p?.images) ? p.images : []
        
        // Process features with better error handling
        const features = Array.isArray(p?.features) 
          ? flattenToStringArray(p.features) 
          : typeof p?.features === "string" 
          ? flattenToStringArray([p.features]) 
          : []
        
        // Process sizes - handle both string arrays and object arrays
        let sizes: string[] = []
        if (Array.isArray(p?.sizes)) {
          sizes = p.sizes.map(size => 
            typeof size === "string" ? size : size?.name || ""
          ).filter(Boolean)
        }
        
        // Process specifications
        let specifications: Record<string, any> = {}
        const parsedSpecs = safeParseJson(p?.specifications || {})
        if (parsedSpecs && typeof parsedSpecs === "object" && !Array.isArray(parsedSpecs)) {
          specifications = parsedSpecs as Record<string, any>
        }
        
        const processedProduct = {
          ...p,
          images,
          features,
          sizes,
          specifications,
          originalPrice: p?.originalPrice ?? p?.price ?? p?.salePrice,
          stock: p?.stock ?? 0
        }
        
        console.log("Final Processed Product:", processedProduct) // Debug log
        
        setProduct(processedProduct)
        
        // Auto-select first available options
        if (sizes.length > 0 && !selectedSize) {
          setSelectedSize(sizes[0])
        }
        
      } catch (e: any) {
        console.error("Fetch Error:", e) // Debug log
        setError(e?.message || "Failed to load product")
      } finally { 
        setLoading(false) 
      }
    }
    
    if (id) {
      fetchById()
    }
  }, [params.id, selectedSize])

  const currentPrice = useMemo(() => {
    if (!product) return 0
    return product.salePrice ?? product.price ?? 0
  }, [product])

  const formatPrice = (price: number): string => 
    new Intl.NumberFormat("en-IN", { 
      style: "currency", 
      currency: "INR", 
      minimumFractionDigits: 0 
    }).format(price)

  // WhatsApp and Call functionality
  const handleWhatsApp = (): void => {
    if (!product) return
    
    const message = `Hi! I'm interested in ${product.name}
    
Price: ${formatPrice(currentPrice)}
${selectedSize ? `Size: ${selectedSize}` : ""}
Quantity: ${quantity}

Please provide more details.`

    const whatsappUrl = `https://wa.me/+919999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCall = (): void => {
    window.open('tel:+919999999999', '_self')
  }

  const toggleWishlist = (): void => {
    if (!product) return
    const id = String(product.id || product._id || params.id)
    if (isInWishlist(id)) {
      removeWishlistItem(id)
    } else {
      addWishlistItem({ 
        id, 
        name: product.name, 
        price: currentPrice, 
        originalPrice: product.originalPrice || currentPrice, 
        image: resolveImageSrc(product.images?.[0] || product.mainImage), 
        category: product.category || "Protectors", 
        rating: product.rating || 0, 
        reviews: product.reviews || 0, 
        inStock: (product.stock ?? 0) > 0 
      })
    }
  }

  const productId = String(product?.id || product?._id || params.id)
  const isWishlisted = product ? isInWishlist(productId) : false

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Product / {product?.name || "Loading..."}
          </span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" /> 
            Loading product details...
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <Card className="p-8 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <div className="font-semibold mb-2">Failed to load product</div>
              <div className="text-muted-foreground mb-4">{error}</div>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </Card>
          </div>
        )}

        {!loading && !error && product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                <Image 
                  src={resolveImageSrc(product.images?.[activeImage] || product.mainImage)} 
                  alt={product.name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button 
                      key={index} 
                      onClick={() => setActiveImage(index)} 
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        activeImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Image 
                        src={resolveImageSrc(image)} 
                        alt={`${product.name} ${index + 1}`} 
                        fill 
                        className="object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="font-playfair text-3xl font-bold mb-2">{product.name}</h1>
                
                {(product.rating || product.reviews) && (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating || 0) 
                              ? "fill-secondary text-secondary" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {product.rating || 0} ({product.reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                )}
                
                {product.description && (
                  <p className="text-muted-foreground text-lg">{product.description}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(currentPrice)}
                </span>
                {product.originalPrice && product.originalPrice > currentPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge variant="destructive">
                      {Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Size Selection */}
              {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Size</h3>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size, index) => (
                        <SelectItem key={index} value={typeof size === "string" ? size : size?.name || ""}>
                          {typeof size === "string" ? size : size?.name || ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="space-y-3">
                <h3 className="font-semibold">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock !== undefined && quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.stock !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </p>
                )}
              </div>

              {/* Action Buttons - WhatsApp and Call */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white" 
                  size="lg" 
                  onClick={handleWhatsApp}
                  disabled={product.stock === 0}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? "Out of Stock" : "WhatsApp"}
                </Button>
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" 
                  size="lg" 
                  onClick={handleCall}
                  disabled={product.stock === 0}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline" size="lg" onClick={toggleWishlist}>
                  <Heart 
                    className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} 
                  />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </Button>
              </div>

              {/* Features */}
              {Array.isArray(product.features) && product.features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <h3 className="font-semibold col-span-full mb-2">Key Features:</h3>
                  {product.features.map((feature, index) => (
                    <div key={index} className="text-muted-foreground text-sm">
                      • {feature}
                    </div>
                  ))}
                </div>
              )}

              {/* Service Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Fast Delivery</p>
                    <p className="text-xs text-muted-foreground">Within 7 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Warranty</p>
                    <p className="text-xs text-muted-foreground">Quality assured</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">Hassle-free</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-medium text-sm">Premium Quality</p>
                    <p className="text-xs text-muted-foreground">Trusted materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Details Tabs */}
        {!loading && !error && product && (
          <div className="mt-16">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="care">Care Instructions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features && product.features.length > 0 ? (
                        product.features.map((feature, index) => (
                          <div key={index} className="text-muted-foreground">
                            • {feature}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No features available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.specifications && Object.keys(product.specifications).length > 0 ? (
                        Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b">
                            <span className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span className="text-muted-foreground">{String(value)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No specifications available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="care" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Care Instructions</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>• Machine wash on gentle cycle with cold water</p>
                      <p>• Use mild detergent, avoid bleach</p>
                      <p>• Tumble dry on low heat or air dry</p>
                      <p>• Do not iron or dry clean</p>
                      <p>• Keep away from direct sunlight when drying</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
