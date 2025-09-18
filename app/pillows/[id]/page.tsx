"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ArrowLeft, Plus, Minus, Loader2, AlertCircle } from "lucide-react"
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
  firmness?: string[] | string
  specifications?: Record<string, any> | string
  category?: string
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
  const walk = (val: unknown) => {
    const maybeParsed = typeof val === "string" && (val.trim().startsWith("[") || val.trim().startsWith("{")) ? safeParseJson(val) : val
    if (Array.isArray(maybeParsed)) for (const item of maybeParsed) walk(item)
    else if (typeof maybeParsed === "string") { const t = maybeParsed.trim(); if (t) result.push(t) }
  }
  walk(input); return Array.from(new Set(result))
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

export default function ProductDetailFromCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedFirmness, setSelectedFirmness] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const id = String(params.id)
    const fetchById = async () => {
      setLoading(true); setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/v1/products/${id}`)
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`)
        const body = await res.json()
        const p: Product = body?.data?.product || body?.product || body
        const images = Array.isArray(p?.images) ? p.images : []
        const features = Array.isArray(p?.features) ? flattenToStringArray(p.features) : typeof p?.features === "string" ? flattenToStringArray([p.features]) : []
        const firmness = Array.isArray(p?.firmness) ? flattenToStringArray(p.firmness) : typeof p?.firmness === "string" ? flattenToStringArray([p.firmness]) : []
        let specifications: Record<string, any> = {}
        const parsedSpecs = safeParseJson(p?.specifications || {})
        if (parsedSpecs && typeof parsedSpecs === "object" && !Array.isArray(parsedSpecs)) specifications = parsedSpecs as Record<string, any>
        setProduct({ ...p, images, features, firmness, specifications, originalPrice: p?.originalPrice ?? p?.price ?? p?.salePrice })
      } catch (e: any) {
        setError(e?.message || "Failed to load product")
      } finally { setLoading(false) }
    }
    fetchById()
  }, [params.id])

  const currentPrice = useMemo(() => {
    if (!product) return 0
    return product.salePrice ?? product.price ?? 0
  }, [product])

  const formatPrice = (price: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(price)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedFirmness) {
      alert("Please select size and firmness")
      return
    }
    if (!product) return
    addItem({
      id: String(product.id || product._id || params.id),
      name: product.name,
      price: currentPrice,
      originalPrice: product.originalPrice || currentPrice,
      image: product.images?.[0] || product.mainImage || "/placeholder.svg",
      size: selectedSize,
      firmness: selectedFirmness,
    }, quantity)
    router.push("/cart")
  }

  const toggleWishlist = () => {
    if (!product) return
    const id = String(product.id || product._id || params.id)
    if (isInWishlist(id)) {
      removeWishlistItem(id)
    } else {
      addWishlistItem({ id, name: product.name, price: currentPrice, originalPrice: product.originalPrice || currentPrice, image: product.images?.[0] || product.mainImage || "/placeholder.svg", category: product.category || "Product", rating: product.rating || 0, reviews: product.reviews || 0, inStock: true })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Product / {product?.name || "..."}</span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading...</div>
        )}
        {error && (
          <div className="flex items-center justify-center py-20">
            <Card className="p-8 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <div className="font-semibold mb-2">Failed to load product</div>
              <div className="text-muted-foreground mb-4">{error}</div>
              <Button onClick={() => router.refresh()}>Retry</Button>
            </Card>
          </div>
        )}

        {!loading && !error && product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                <Image src={resolveImageSrc(product.images?.[activeImage] || product.mainImage)} alt={product.name} fill className="object-cover" />
                {product.badge && (
                  <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">{product.badge}</Badge>
                )}
              </div>
              <div className="flex gap-2">
                {(product.images || []).map((image, index) => (
                  <button key={index} onClick={() => setActiveImage(index)} className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImage === index ? "border-primary" : "border-transparent"}`}>
                    <Image src={resolveImageSrc(image)} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-playfair text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? "fill-secondary text-secondary" : "text-gray-300"}`} />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">{product.rating || 0} ({product.reviews || 0} reviews)</span>
                  </div>
                </div>
                {product.description && <p className="text-muted-foreground text-lg">{product.description}</p>}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
                {product.originalPrice && product.originalPrice > currentPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                    <Badge variant="destructive">{Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}% OFF</Badge>
                  </>
                )}
              </div>

              {Array.isArray(product.firmness) && product.firmness.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Firmness</h3>
                  <Select value={selectedFirmness} onValueChange={setSelectedFirmness}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select firmness" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.firmness.map((firm) => (
                        <SelectItem key={firm} value={firm}>{firm}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-primary hover:bg-primary/90" size="lg" onClick={handleAddToCart}>Add to Cart</Button>
                <Button variant="outline" size="lg" onClick={toggleWishlist}>
                  <Heart className={`w-4 h-4 mr-2 ${isInWishlist(String(product.id || product._id || params.id)) ? "fill-red-500 text-red-500" : ""}`} />
                  {isInWishlist(String(product.id || product._id || params.id)) ? "Wishlisted" : "Wishlist"}
                </Button>
              </div>

              {Array.isArray(product.features) && product.features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.features.map((f, i) => (
                    <div key={i} className="text-muted-foreground text-sm">• {f}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !error && product && (
          <div className="mt-16">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="care">Care</TabsTrigger>
              </TabsList>
              <TabsContent value="features" className="mt-8">
                <Card><CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(product.features || []).map((f, i) => (
                      <div key={i} className="text-muted-foreground">{f}</div>
                    ))}
                  </div>
                </CardContent></Card>
              </TabsContent>
              <TabsContent value="specifications" className="mt-8">
                <Card><CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries((product.specifications as Record<string, any>) || {}).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b">
                        <span className="font-medium capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                        <span className="text-muted-foreground">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent></Card>
              </TabsContent>
              <TabsContent value="care" className="mt-8">
                <Card><CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Care Instructions</h3>
                  <div className="text-muted-foreground">Spot clean with mild detergent and air dry.</div>
                </CardContent></Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}


