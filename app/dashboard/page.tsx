"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Heart, MapPin, User, ShoppingBag, TrendingUp, Star } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { items: cartItems } = useCart()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    totalSpent: 0,
    averageRating: 0
  })

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Simulate loading user stats
    setStats({
      totalOrders: 3,
      wishlistItems: 2,
      totalSpent: 45000,
      averageRating: 4.5
    })
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
        <p className="text-lg text-slate-600 mt-2">Here's an overview of your account and recent activity.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <Package className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Wishlist Items</p>
                <p className="text-3xl font-bold text-red-600">{stats.wishlistItems}</p>
              </div>
              <Heart className="h-10 w-10 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-600">Cart Items</p>
                <p className="text-3xl font-bold text-green-600">{cartItems.length}</p>
              </div>
              <ShoppingBag className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Spent</p>
                <p className="text-3xl font-bold text-purple-600">{formatPrice(stats.totalSpent)}</p>
          </div>
              <TrendingUp className="h-10 w-10 text-purple-600" />
        </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
          <Card className="border-blue-200">
              <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Name</p>
                <p className="text-slate-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Email</p>
                <p className="text-slate-900">{user?.email}</p>
                </div>
              {user?.phone && (
                  <div>
                    <p className="text-sm font-medium text-slate-700">Phone</p>
                    <p className="text-slate-900">{user.phone}</p>
                  </div>
                )}
              <Button 
                variant="outline" 
                className="w-full bg-transparent"
                onClick={() => router.push("/dashboard/profile")}
              >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Recent Orders</CardTitle>
              <CardDescription>Your recent mattress orders</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.totalOrders > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-blue-100 rounded-lg bg-blue-50/30">
                    <div>
                      <p className="font-medium text-slate-900">Order #12345</p>
                      <p className="text-sm text-slate-600">Premium Memory Foam Mattress</p>
                      <p className="text-xs text-slate-500">Ordered on Dec 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{formatPrice(25000)}</p>
                      <p className="text-sm text-green-600">Delivered</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push("/dashboard/orders")}
                      className="bg-transparent"
                    >
                      View All Orders
                    </Button>
                  </div>
            </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No orders yet</p>
                  <p className="text-sm text-slate-500 mb-4">Start shopping for your perfect mattress!</p>
                  <Button onClick={() => router.push("/products")}>Browse Mattresses</Button>
                </div>
              )}
              </CardContent>
            </Card>

            {/* Address Book */}
          <Card className="border-blue-200">
              <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                  <MapPin className="h-5 w-5" />
                  Address Book
                </CardTitle>
              </CardHeader>
              <CardContent>
              {user?.address ? (
                <div className="space-y-4">
                  <div className="p-4 border border-blue-100 rounded-lg bg-blue-50/30">
                    <p className="font-medium">Default Address</p>
                    <p className="text-slate-600 mt-1">
                      {user.address.street}, {user.address.city}, {user.address.state} - {user.address.pincode}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/dashboard/addresses")}
                    className="w-full bg-transparent"
                  >
                    Manage Addresses
                  </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MapPin className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 mb-4">No addresses saved</p>
                  <Button 
                    variant="outline"
                    onClick={() => router.push("/dashboard/addresses")}
                  >
                    Add Address
                  </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          {/* Quick Actions */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/dashboard/wishlist")}
                >
                  <Heart className="h-6 w-6" />
                  <span>View Wishlist</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/cart")}
                >
                  <ShoppingBag className="h-6 w-6" />
                  <span>View Cart</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/products")}
                >
                  <Package className="h-6 w-6" />
                  <span>Browse Products</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <Star className="h-6 w-6" />
                  <span>Account Settings</span>
                </Button>
          </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
