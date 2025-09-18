"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { adminService } from "@/lib/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AdminDashboard() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([]) // Add users state

  useEffect(() => {
    if (user) {
      const analyticsData = adminService.getAnalytics()
      setAnalytics(analyticsData)

      // Fetch all users
      const fetchUsers = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/v1/admin/users`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
          const data = await res.json()
          setUsers(data || [])
        } catch (err) {
          console.error("Failed to fetch users:", err)
        }
      }
      fetchUsers()
    }
  }, [user])

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
        <h1 className="text-4xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-lg text-slate-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-slate-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-blue-600">{formatPrice(analytics.totalRevenue)}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-slate-600">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.totalOrders}</p>
                </div>
                <ShoppingCart className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-slate-600">Products</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.totalProducts}</p>
                </div>
                <Package className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-slate-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.pendingOrders}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.recentOrders?.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-blue-100 rounded-lg bg-blue-50/30"
                  >
                    <div>
                      <p className="font-medium text-slate-900">Order #{order.id}</p>
                      <p className="text-sm text-slate-600">{order.userName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{formatPrice(order.total)}</p>
                      <Badge variant={order.status === "pending" ? "secondary" : "default"}>{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Inventory Status</CardTitle>
            <CardDescription>Products requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.outOfStockProducts > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">Low Stock Alert</p>
                    <p className="text-sm text-orange-700">{analytics.outOfStockProducts} products need restocking</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-600 font-medium">All products in stock</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Users List Section */}
      <Card className="border-blue-200 mt-8">
        <CardHeader>
          <CardTitle className="text-blue-700">All Users</CardTitle>
          <CardDescription>List of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u._id} className="flex justify-between items-center border-b py-2">
                  <span className="font-medium">{u.name || u.email}</span>
                  <span className="text-slate-600">{u.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-4">No users found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
