"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Eye, Star } from "lucide-react"
import Image from "next/image"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"

export default function WishlistPage() {
  const { items: wishlistItems, removeItem, isLoading } = useWishlist()
  const { addItem } = useCart()
  useEffect(() => {}, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const removeFromWishlist = (itemId: string) => removeItem(itemId)

  const addToCart = (item: any) => {
    addItem({ id: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice, image: item.image, size: "", firmness: "", quantity: 1 })
  }

  const moveAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock)
    inStockItems.forEach(item => addToCart(item))
    // Remove in-stock items from wishlist after adding to cart
    setWishlistItems(prev => prev.filter(item => !item.inStock))
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Heart className="h-8 w-8 animate-pulse text-red-500 mx-auto mb-4" />
            <p className="text-slate-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">My Wishlist</h1>
            <p className="text-lg text-slate-600 mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          {wishlistItems.some(item => item.inStock) && (
            <Button 
              onClick={moveAllToCart}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Move All to Cart
            </Button>
          )}
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="relative">
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-slate-600">{item.category}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {item.rating} ({item.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                  {item.originalPrice && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                {/* Added Date */}
                <p className="text-xs text-slate-500">
                  Added on {formatDate(item.addedDate)}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => window.location.href = `/products/${item.id}`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-red-200">
          <CardContent className="text-center py-12">
            <Heart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-600 mb-6">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Button onClick={() => window.location.href = "/products"}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {wishlistItems.length > 0 && (
        <Card className="mt-8 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Wishlist Summary</h3>
                <p className="text-sm text-slate-600">
                  {wishlistItems.length} items • {wishlistItems.filter(item => item.inStock).length} in stock
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Total Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(wishlistItems.reduce((sum, item) => sum + item.price, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
