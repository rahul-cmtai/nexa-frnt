"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Star, Heart, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { useWishlist } from "@/contexts/wishlist-context"

export default function ProductsPage() {
  const { addItem } = useCart()
  const router = useRouter()
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist()
  const [priceRange, setPriceRange] = useState([0, 150000])
  const [sortBy, setSortBy] = useState("popularity")
  const [selectedSize, setSelectedSize] = useState("all")
  const [selectedFirmness, setSelectedFirmness] = useState("all")

  const products = [
    {
      id: 1,
      name: "Nexa Cloud Memory Foam",
      originalPrice: 89999,
      salePrice: 59999,
      rating: 4.8,
      reviews: 1247,
      image: "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
      badge: "Best Seller",
      features: ["Cooling Gel", "Memory Foam", "Medium Firm"],
      sizes: ["Single", "Double", "Queen", "King"],
      firmness: "Medium",
    },
    {
      id: 2,
      name: "Nexa Hybrid Luxury",
      originalPrice: 119999,
      salePrice: 89999,
      rating: 4.9,
      reviews: 892,
      image: "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
      badge: "Premium",
      features: ["Pocket Springs", "Latex Top", "Firm Support"],
      sizes: ["Double", "Queen", "King"],
      firmness: "Firm",
    },
    {
      id: 3,
      name: "Nexa Ortho Plus",
      originalPrice: 69999,
      salePrice: 49999,
      rating: 4.7,
      reviews: 634,
      image: "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      badge: "Ortho Care",
      features: ["Orthopedic", "Firm Support", "Spinal Alignment"],
      sizes: ["Single", "Double", "Queen", "King"],
      firmness: "Extra Firm",
    },
    {
      id: 4,
      name: "Nexa Soft Comfort",
      originalPrice: 79999,
      salePrice: 54999,
      rating: 4.6,
      reviews: 456,
      image: "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
      badge: "Comfort Plus",
      features: ["Plush Top", "Memory Foam", "Soft Support"],
      sizes: ["Single", "Double", "Queen", "King"],
      firmness: "Soft",
    },
    {
      id: 5,
      name: "Nexa Natural Latex",
      originalPrice: 139999,
      salePrice: 99999,
      rating: 4.8,
      reviews: 321,
      image: "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
      badge: "Eco-Friendly",
      features: ["100% Natural Latex", "Organic Cotton", "Breathable"],
      sizes: ["Double", "Queen", "King"],
      firmness: "Medium Firm",
    },
    {
      id: 6,
      name: "Nexa Cool Breeze",
      originalPrice: 94999,
      salePrice: 69999,
      rating: 4.7,
      reviews: 789,
      image: "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      badge: "Cooling Tech",
      features: ["Advanced Cooling", "Gel Infused", "Temperature Control"],
      sizes: ["Single", "Double", "Queen", "King"],
      firmness: "Medium",
    },
  ]

  const filteredProducts = products.filter((product) => {
    const priceInRange = product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1]
    const sizeMatch = selectedSize === "all" || product.sizes.includes(selectedSize)
    const firmnessMatch = selectedFirmness === "all" || product.firmness === selectedFirmness
    return priceInRange && sizeMatch && firmnessMatch
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Our Mattress Collection</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Discover the perfect mattress for your sleep needs. Each mattress is crafted with premium materials and
            designed for exceptional comfort and support.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Filters</h2>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={150000}
                  min={0}
                  step={5000}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Size</h3>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double</SelectItem>
                    <SelectItem value="Queen">Queen</SelectItem>
                    <SelectItem value="King">King</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Firmness Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Firmness</h3>
                <Select value={selectedFirmness} onValueChange={setSelectedFirmness}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select firmness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Firmness</SelectItem>
                    <SelectItem value="Soft">Soft</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Medium Firm">Medium Firm</SelectItem>
                    <SelectItem value="Firm">Firm</SelectItem>
                    <SelectItem value="Extra Firm">Extra Firm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
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

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                      {product.badge}
                    </Badge>
                    <button
                      type="button"
                      className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white transition"
                      onClick={() => {
                        const id = String(product.id)
                        if (isInWishlist(id)) {
                          removeWishlistItem(id)
                        } else {
                          addWishlistItem({
                            id,
                            name: product.name,
                            price: product.salePrice,
                            originalPrice: product.originalPrice,
                            image: product.image,
                            category: "Mattress",
                            rating: product.rating,
                            reviews: product.reviews,
                            inStock: true,
                          })
                        }
                      }}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(String(product.id)) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-playfair text-xl font-bold mb-2">{product.name}</h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">₹{product.salePrice.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          const defaultSize = product.sizes[0] || ""
                          const defaultFirmness = product.firmness || ""
                          addItem(
                            {
                              id: String(product.id),
                              name: product.name,
                              price: product.salePrice,
                              originalPrice: product.originalPrice,
                              image: product.image,
                              size: defaultSize,
                              firmness: defaultFirmness,
                            },
                            1,
                          )
                          router.push("/cart")
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
