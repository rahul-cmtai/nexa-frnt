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
import { useWishlist } from "@/contexts/wishlist-context"
import { useRouter } from "next/navigation"

export default function ProtectorsPage() {
  const { addItem } = useCart()
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist()
  const router = useRouter()
  const [priceRange, setPriceRange] = useState([0, 15000])
  const [sortBy, setSortBy] = useState("popularity")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")

  const products = [
    {
      id: 1,
      name: "Flo Mattress Protector",
      originalPrice: 4999,
      salePrice: 3499,
      rating: 4.8,
      reviews: 1247,
      image: "/person-cleaning-and-maintaining-mattress.jpg",
      badge: "Best Seller",
      features: ["Waterproof", "Breathable", "Hypoallergenic"],
      type: "Mattress Protector",
      sizes: ["Single", "Double", "Queen", "King"],
    },
    {
      id: 2,
      name: "Flo Pillow Protector",
      originalPrice: 1999,
      salePrice: 1299,
      rating: 4.9,
      reviews: 892,
      image: "/peaceful-bedroom-setup-for-good-sleep.jpg",
      badge: "Premium",
      features: ["Zippered Design", "Machine Washable", "Soft Feel"],
      type: "Pillow Protector",
      sizes: ["Standard", "Queen", "King"],
    },
    {
      id: 3,
      name: "Flo Cooling Protector",
      originalPrice: 5999,
      salePrice: 3999,
      rating: 4.7,
      reviews: 634,
      image: "/peaceful-bedroom-setup-with-optimal-sleep-hygie.jpg",
      badge: "Cooling Tech",
      features: ["Advanced Cooling", "Temperature Control", "Moisture Wicking"],
      type: "Mattress Protector",
      sizes: ["Single", "Double", "Queen", "King"],
    },
    {
      id: 4,
      name: "Flo Organic Protector",
      originalPrice: 6999,
      salePrice: 4999,
      rating: 4.6,
      reviews: 456,
      image: "/luxury-bedroom-with-premium-mattress--modern-minim.jpg",
      badge: "Eco-Friendly",
      features: ["100% Organic Cotton", "Chemical-Free", "Sustainable"],
      type: "Mattress Protector",
      sizes: ["Double", "Queen", "King"],
    },
    {
      id: 5,
      name: "Flo Bamboo Protector",
      originalPrice: 4499,
      salePrice: 2999,
      rating: 4.8,
      reviews: 321,
      image: "/person-sleeping-comfortably-on-mattress.jpg",
      badge: "Antimicrobial",
      features: ["Bamboo Fiber", "Antimicrobial", "Odor Resistant"],
      type: "Mattress Protector",
      sizes: ["Single", "Double", "Queen", "King"],
    },
    {
      id: 6,
      name: "Flo Luxury Pillow Protector Set",
      originalPrice: 2999,
      salePrice: 1999,
      rating: 4.7,
      reviews: 789,
      image: "/peaceful-bedroom-setup-for-good-sleep.jpg",
      badge: "Set of 2",
      features: ["Set of 2", "Silky Feel", "Easy Care"],
      type: "Pillow Protector",
      sizes: ["Standard", "Queen"],
    },
  ]

  const filteredProducts = products.filter((product) => {
    const priceInRange = product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1]
    const typeMatch = selectedType === "all" || product.type === selectedType
    const sizeMatch = selectedSize === "all" || product.sizes.includes(selectedSize)
    return priceInRange && typeMatch && sizeMatch
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Mattress & Pillow Protectors</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Protect your investment with our premium mattress and pillow protectors. Designed to keep your bedding
            clean, fresh, and hygienic while maintaining comfort.
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
                  max={15000}
                  min={0}
                  step={500}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Type</h3>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Mattress Protector">Mattress Protector</SelectItem>
                    <SelectItem value="Pillow Protector">Pillow Protector</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="Standard">Standard</SelectItem>
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
                            category: product.type,
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
                        <Link href={`/protectors/${product.id}`}>View Details</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          const defaultSize = (product.sizes && product.sizes[0]) || ""
                          addItem(
                            {
                              id: String(product.id),
                              name: product.name,
                              price: product.salePrice,
                              originalPrice: product.originalPrice,
                              image: product.image,
                              size: defaultSize,
                              firmness: "",
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
