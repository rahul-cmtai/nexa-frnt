"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FeaturedProducts } from "@/components/sections/featured-products"

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleQuantityChange = async (id: string, size: string, firmness: string, newQuantity: number) => {
    setIsUpdating(`${id}-${size}-${firmness}`)
    updateQuantity(id, size, firmness, newQuantity)
    setTimeout(() => setIsUpdating(null), 300)
  }

  const handleRemoveItem = (id: string, size: string, firmness: string) => {
    removeItem(id, size, firmness)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-slate-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Start shopping for your perfect mattress!</p>
            <Button onClick={() => router.push("/products")} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Browse Mattresses
            </Button>
          </div>
          <div className="mt-4">
            <FeaturedProducts />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemKey = `${item.id}-${item.size}-${item.firmness}`
              const isItemUpdating = isUpdating === itemKey

              return (
                <Card key={itemKey} className="overflow-hidden border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.size}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {item.firmness}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id, item.size, item.firmness)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{formatPrice(item.price)}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-sm text-slate-500 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => handleQuantityChange(item.id, item.size, item.firmness, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isItemUpdating}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = Number.parseInt(e.target.value) || 1
                                handleQuantityChange(item.id, item.size, item.firmness, newQuantity)
                              }}
                              className="w-16 h-8 text-center"
                              min="1"
                              max={item.maxQuantity || 10}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => handleQuantityChange(item.id, item.size, item.firmness, item.quantity + 1)}
                              disabled={isItemUpdating || (!!item.maxQuantity && item.quantity >= (item.maxQuantity || 0))}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-2 text-right">
                          <span className="text-sm text-muted-foreground">Subtotal: </span>
                          <span className="font-semibold text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-blue-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-semibold text-foreground mb-6">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    onClick={() => router.push("/checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/products")}>
                    Continue Shopping
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl mb-1">🚚</div>
                      <div className="text-xs text-slate-600">Free Delivery</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">🛡️</div>
                      <div className="text-xs text-slate-600">10 Year Warranty</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">🌙</div>
                      <div className="text-xs text-slate-600">100 Night Trial</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">💳</div>
                      <div className="text-xs text-slate-600">Secure Payment</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <FeaturedProducts />
        </div>
      </div>
      <Footer />
    </div>
  )
}
