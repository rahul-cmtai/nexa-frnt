import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function FeaturedProducts() {
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
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Featured Mattresses</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Discover our most popular mattresses, each designed to deliver exceptional comfort and support for your best
            night's sleep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
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
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">{product.badge}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
                >
                  <Heart className="w-4 h-4" />
                </Button>
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
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/products">View All Mattresses</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
