"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Truck, Shield, RotateCcw, Award, ArrowLeft, Plus, Minus } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedFirmness, setSelectedFirmness] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  // Product data based on ID - in real app, fetch from API
  const products = [
    {
      id: 1,
      name: "Nexa Cloud Memory Foam",
      originalPrice: 89999,
      salePrice: 59999,
      rating: 4.8,
      reviews: 1247,
      images: [
        "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
        "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
        "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      ],
      badge: "Best Seller",
      description:
        "Experience the ultimate in sleep comfort with our premium memory foam mattress. Designed with advanced cooling gel technology and superior pressure relief for the perfect night's sleep.",
      features: [
        "Advanced cooling gel technology",
        "Pressure-relieving memory foam",
        "Motion isolation for undisturbed sleep",
        "Breathable bamboo fabric cover",
        "CertiPUR-US certified foam",
        "10-year warranty",
      ],
      sizes: [
        { name: "Single", price: 59999, dimensions: '72" x 36"' },
        { name: "Double", price: 69999, dimensions: '72" x 48"' },
        { name: "Queen", price: 79999, dimensions: '78" x 60"' },
        { name: "King", price: 89999, dimensions: '78" x 72"' },
      ],
      firmness: ["Soft", "Medium", "Firm"],
      specifications: {
        thickness: "10 inches",
        layers: "3-layer construction",
        material: "Memory foam with cooling gel",
        cover: "Bamboo fabric",
        warranty: "10 years",
        trial: "100 nights",
      },
    },
    {
      id: 2,
      name: "Nexa Hybrid Luxury",
      originalPrice: 119999,
      salePrice: 89999,
      rating: 4.9,
      reviews: 892,
      images: [
        "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
        "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
        "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      ],
      badge: "Premium",
      description:
        "Luxury meets innovation with our hybrid mattress combining pocket springs and premium materials for ultimate comfort and support.",
      features: [
        "Pocket spring system",
        "Premium latex top layer",
        "Firm support for all sleep positions",
        "Temperature regulating cover",
        "Edge support technology",
        "15-year warranty",
      ],
      sizes: [
        { name: "Double", price: 89999, dimensions: '72" x 48"' },
        { name: "Queen", price: 99999, dimensions: '78" x 60"' },
        { name: "King", price: 109999, dimensions: '78" x 72"' },
      ],
      firmness: ["Medium", "Firm"],
      specifications: {
        thickness: "12 inches",
        layers: "4-layer construction",
        material: "Pocket springs + Latex + Memory foam",
        cover: "Temperature regulating fabric",
        warranty: "15 years",
        trial: "100 nights",
      },
    },
    {
      id: 3,
      name: "Nexa Ortho Plus",
      originalPrice: 69999,
      salePrice: 49999,
      rating: 4.7,
      reviews: 634,
      images: [
        "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
        "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
        "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
      ],
      badge: "Ortho Care",
      description:
        "Orthopedic support designed for spinal alignment and pressure relief. Perfect for those who need extra support for back and joint health.",
      features: [
        "Orthopedic support system",
        "Firm support for spine alignment",
        "Pressure point relief",
        "Hypoallergenic materials",
        "Anti-microbial treatment",
        "12-year warranty",
      ],
      sizes: [
        { name: "Single", price: 49999, dimensions: '72" x 36"' },
        { name: "Double", price: 59999, dimensions: '72" x 48"' },
        { name: "Queen", price: 69999, dimensions: '78" x 60"' },
        { name: "King", price: 79999, dimensions: '78" x 72"' },
      ],
      firmness: ["Firm", "Extra Firm"],
      specifications: {
        thickness: "10 inches",
        layers: "3-layer construction",
        material: "High-density foam + Orthopedic support",
        cover: "Hypoallergenic fabric",
        warranty: "12 years",
        trial: "100 nights",
      },
    },
    {
      id: 4,
      name: "Nexa Soft Comfort",
      originalPrice: 79999,
      salePrice: 54999,
      rating: 4.6,
      reviews: 456,
      images: [
        "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
        "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
        "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      ],
      badge: "Comfort Plus",
      description:
        "Plush comfort that cradles you to sleep. Our softest mattress for those who love a cloud-like feel and gentle support.",
      features: [
        "Plush top layer",
        "Soft memory foam",
        "Gentle pressure relief",
        "Breathable cover",
        "Motion isolation",
        "10-year warranty",
      ],
      sizes: [
        { name: "Single", price: 54999, dimensions: '72" x 36"' },
        { name: "Double", price: 64999, dimensions: '72" x 48"' },
        { name: "Queen", price: 74999, dimensions: '78" x 60"' },
        { name: "King", price: 84999, dimensions: '78" x 72"' },
      ],
      firmness: ["Soft", "Medium Soft"],
      specifications: {
        thickness: "10 inches",
        layers: "3-layer construction",
        material: "Soft memory foam + Plush top",
        cover: "Breathable cotton blend",
        warranty: "10 years",
        trial: "100 nights",
      },
    },
    {
      id: 5,
      name: "Nexa Natural Latex",
      originalPrice: 139999,
      salePrice: 99999,
      rating: 4.8,
      reviews: 321,
      images: [
        "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
        "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
        "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      ],
      badge: "Eco-Friendly",
      description:
        "100% natural latex mattress for eco-conscious sleepers. Breathable, hypoallergenic, and incredibly comfortable with natural bounce.",
      features: [
        "100% natural latex",
        "Organic cotton cover",
        "Breathable and cool",
        "Hypoallergenic",
        "Eco-friendly materials",
        "20-year warranty",
      ],
      sizes: [
        { name: "Double", price: 99999, dimensions: '72" x 48"' },
        { name: "Queen", price: 109999, dimensions: '78" x 60"' },
        { name: "King", price: 119999, dimensions: '78" x 72"' },
      ],
      firmness: ["Medium", "Medium Firm"],
      specifications: {
        thickness: "11 inches",
        layers: "2-layer construction",
        material: "100% natural latex",
        cover: "Organic cotton",
        warranty: "20 years",
        trial: "100 nights",
      },
    },
    {
      id: 6,
      name: "Nexa Cool Breeze",
      originalPrice: 94999,
      salePrice: 69999,
      rating: 4.7,
      reviews: 789,
      images: [
        "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
        "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
        "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
      ],
      badge: "Cooling Tech",
      description:
        "Advanced cooling technology keeps you comfortable all night long. Perfect for hot sleepers and warm climates.",
      features: [
        "Advanced cooling gel",
        "Temperature control",
        "Gel-infused memory foam",
        "Breathable cover",
        "Moisture-wicking technology",
        "12-year warranty",
      ],
      sizes: [
        { name: "Single", price: 69999, dimensions: '72" x 36"' },
        { name: "Double", price: 79999, dimensions: '72" x 48"' },
        { name: "Queen", price: 89999, dimensions: '78" x 60"' },
        { name: "King", price: 99999, dimensions: '78" x 72"' },
      ],
      firmness: ["Medium", "Medium Firm"],
      specifications: {
        thickness: "10 inches",
        layers: "3-layer construction",
        material: "Cooling gel + Memory foam",
        cover: "Temperature regulating fabric",
        warranty: "12 years",
        trial: "100 nights",
      },
    },
  ]

  const product = products.find((p) => p.id === Number(params.id)) || products[0]

  const selectedSizeData = product.sizes.find((size) => size.name === selectedSize)
  const currentPrice = selectedSizeData?.price || product.salePrice

  const handleAddToCart = () => {
    if (!selectedSize || !selectedFirmness) {
      alert("Please select size and firmness")
      return
    }

    addItem({
      id: product.id.toString(),
      name: product.name,
      price: currentPrice,
      originalPrice: product.originalPrice,
      image: product.images[0],
      size: selectedSize,
      firmness: selectedFirmness,
    })

    router.push("/cart")
  }

  const handleToggleWishlist = () => {
    const id = product.id.toString()
    if (isInWishlist(id)) {
      removeWishlistItem(id)
    } else {
      addWishlistItem({
        id,
        name: product.name,
        price: product.salePrice,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: "Mattress",
        rating: product.rating,
        reviews: product.reviews,
        inStock: true,
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Products / {product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
              <Image
                src={product.images[activeImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">{product.badge}</Badge>
            </div>
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    activeImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="font-playfair text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
              <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              <Badge variant="destructive">
                {Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}% OFF
              </Badge>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">Size</h3>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size.name} value={size.name}>
                      {size.name} ({size.dimensions}) - {formatPrice(size.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Firmness Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">Firmness</h3>
              <Select value={selectedFirmness} onValueChange={setSelectedFirmness}>
                <SelectTrigger>
                  <SelectValue placeholder="Select firmness" />
                </SelectTrigger>
                <SelectContent>
                  {product.firmness.map((firmness) => (
                    <SelectItem key={firmness} value={firmness}>
                      {firmness}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
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
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1 bg-primary hover:bg-primary/90" size="lg" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" onClick={handleToggleWishlist}>
                <Heart className={`w-4 h-4 mr-2 ${isInWishlist(product.id.toString()) ? "fill-red-500 text-red-500" : ""}`} />
                {isInWishlist(product.id.toString()) ? "Wishlisted" : "Wishlist"}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Within 7 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">10 Year Warranty</p>
                  <p className="text-xs text-muted-foreground">Full coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">100 Night Trial</p>
                  <p className="text-xs text-muted-foreground">Risk-free</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="font-medium text-sm">Certified Quality</p>
                  <p className="text-xs text-muted-foreground">CertiPUR-US</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
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
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
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
                      <h4 className="font-semibold mb-2">Daily Care</h4>
                      <p className="text-muted-foreground">
                        Allow your mattress to air out daily and rotate every 3 months for even wear.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Cleaning</h4>
                      <p className="text-muted-foreground">
                        Spot clean with mild detergent and water. Do not soak or machine wash.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Protection</h4>
                      <p className="text-muted-foreground">
                        Use a mattress protector to prevent stains and extend the life of your mattress.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
