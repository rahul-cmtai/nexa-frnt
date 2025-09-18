"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ArrowLeft, Plus, Minus, Truck, Shield, RotateCcw, Award } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

interface Product {
  id: number | string
  name: string
  originalPrice: number
  salePrice: number
  rating: number
  reviews: number
  image: string
  badge?: string
  features: string[]
  sizes?: string[]
  firmness?: string[]
  description?: string
}

export default function AccessoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist()

  // Mirror the list data so details can be resolved client-side by id
  const products: Product[] = [
    { id: 1, name: "Flo Weighted Blanket", originalPrice: 8999, salePrice: 5999, rating: 4.8, reviews: 1247, image: "/person-sleeping-comfortably-on-mattress.jpg", badge: "Best Seller", features: ["Deep Pressure Therapy", "Breathable", "Machine Washable"], sizes: ["Single", "Double", "Queen", "King"], description: "Premium weighted blanket for deep sleep." },
    { id: 2, name: "Flo Fitted Bedsheets", originalPrice: 3999, salePrice: 2499, rating: 4.9, reviews: 892, image: "/luxury-bedroom-with-premium-mattress--modern-minim.jpg", badge: "Premium", features: ["100% Cotton", "Deep Pockets", "Wrinkle Resistant"], sizes: ["Single", "Double", "Queen", "King"], description: "Soft, breathable fitted bedsheets." },
    { id: 3, name: "Flo Cooling Weighted Blanket", originalPrice: 11999, salePrice: 7999, rating: 4.7, reviews: 634, image: "/peaceful-bedroom-setup-with-optimal-sleep-hygie.jpg", badge: "Cooling Tech", features: ["Advanced Cooling", "Temperature Control", "Hypoallergenic"], sizes: ["Double", "Queen", "King"], description: "Stay cool while you sleep." },
    { id: 4, name: "Flo Organic Bedsheet Set", originalPrice: 5999, salePrice: 3999, rating: 4.6, reviews: 456, image: "/peaceful-bedroom-setup-for-good-sleep.jpg", badge: "Eco-Friendly", features: ["Organic Cotton", "Chemical-Free", "Set of 4"], sizes: ["Double", "Queen", "King"], description: "Eco-friendly organic bedsheets." },
    { id: 5, name: "Flo Bamboo Bedsheets", originalPrice: 4999, salePrice: 3499, rating: 4.8, reviews: 321, image: "/luxury-bedroom-with-premium-mattress--modern-minim.jpg", badge: "Antimicrobial", features: ["Bamboo Fiber", "Antimicrobial", "Moisture Wicking"], sizes: ["Single", "Double", "Queen", "King"], description: "Luxurious bamboo bedsheets." },
    { id: 6, name: "Flo Silk Bedsheet Set", originalPrice: 15999, salePrice: 10999, rating: 4.7, reviews: 789, image: "/person-sleeping-comfortably-on-mattress.jpg", badge: "Luxury", features: ["100% Mulberry Silk", "Temperature Regulating", "Set of 4"], sizes: ["Double", "Queen", "King"], description: "Ultimate luxury silk bedsheets." },
  ]

  const resolved = products.find((p) => String(p.id) === String(params.id)) || null
  const [product] = useState<Product | null>(resolved)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedFirmness, setSelectedFirmness] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const currentPrice = useMemo(() => product?.salePrice ?? 0, [product])
  const galleryImages = useMemo(() => {
    if (!product) return [] as string[]
    const dummies = [
      "/luxury-bedroom-with-premium-mattress--modern-minim.jpg",
      "/peaceful-bedroom-setup-for-good-sleep.jpg",
      "/peaceful-bedroom-setup-with-optimal-sleep-hygie.jpg",
    ]
    const unique = Array.from(new Set([product.image, ...dummies].filter(Boolean))) as string[]
    return unique
  }, [product])

  const formatPrice = (price: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(price)

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: String(product.id),
      name: product.name,
      price: currentPrice,
      originalPrice: product.originalPrice,
      image: product.image,
      size: selectedSize,
      firmness: selectedFirmness,
    }, quantity)
    router.push("/cart")
  }

  const toggleWishlist = () => {
    if (!product) return
    const id = String(product.id)
    if (isInWishlist(id)) removeWishlistItem(id)
    else addWishlistItem({ id, name: product.name, price: currentPrice, originalPrice: product.originalPrice, image: product.image, category: "Accessories", rating: product.rating, reviews: product.reviews, inStock: true })
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

        {!product ? (
          <div className="text-center text-muted-foreground py-20">No product data. Go back and try again.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                <Image
                  src={galleryImages[activeImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.badge && <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">{product.badge}</Badge>}
              </div>
              {/* Thumbnails - single image fallback */}
              <div className="flex gap-2">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImage === index ? "border-primary" : "border-transparent"}`}
                  >
                    <Image src={img || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
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
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
                {product.description && <p className="text-muted-foreground text-lg">{product.description}</p>}
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
                <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                <Badge variant="destructive">
                  {Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}% OFF
                </Badge>
              </div>

              {/* Optional selectors */}
              {!!product.sizes?.length && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Size</h3>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {!!product.firmness?.length && (
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

              {/* Quantity */}
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

              {/* Actions */}
              <div className="flex gap-4">
                <Button className="flex-1 bg-primary hover:bg-primary/90" size="lg" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" onClick={toggleWishlist}>
                  <Heart className={`w-4 h-4 mr-2 ${isInWishlist(String(product.id)) ? "fill-red-500 text-red-500" : ""}`} />
                  {isInWishlist(String(product.id)) ? "Wishlisted" : "Wishlist"}
                </Button>
              </div>

              {/* Trust badges */}
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

        {!!product && (
          <div className="mt-16">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="care">Care Guide</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <p className="text-muted-foreground">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-muted-foreground">No specifications available.</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Reviews feature coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="care" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Care Instructions</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Cleaning</h4>
                        <p className="text-muted-foreground">Follow label instructions. Machine wash if allowed.</p>
                      </div>
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



