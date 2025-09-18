"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"

export default function PublicWishlistPage() {
  const router = useRouter()
  const { items, isLoading, removeItem } = useWishlist()
  const { addItem } = useCart()

  useEffect(() => {}, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(price)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground">Save your favourites and buy when ready</p>
          </div>
          {items.length > 0 && (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/cart")}>Go to Cart</Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-24">
            <Heart className="h-10 w-10 text-red-500 mx-auto animate-pulse" />
            <p className="mt-3 text-muted-foreground">Loading your wishlist...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Tap the heart on a product to save it here.</p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/products")}>Browse Products</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="border-red-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden bg-slate-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    {item.inStock === false && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">Out of Stock</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <button onClick={() => removeItem(item.id)}>
                        <Heart className="h-5 w-5 text-red-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-foreground">{formatPrice(item.price)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{formatPrice(item.originalPrice)}</span>
                      )}
                      {item.originalPrice && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(item.rating) ? "text-yellow-400 fill-current" : "text-slate-300"}`} />
                        ))}
                      </div>
                      <span>
                        {item.rating} ({item.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            originalPrice: item.originalPrice,
                            size: "",
                            firmness: "",
                            quantity: 1,
                          })
                          router.push("/cart")
                        }}
                        disabled={item.inStock === false}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.inStock === false ? "Out of Stock" : "Add to Cart"}
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.push(`/products/${item.id}`)}>
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Separator className="my-12" />
        <div className="mt-8">
          <FeaturedProducts />
        </div>
      </div>
      <Footer />
    </div>
  )
}


