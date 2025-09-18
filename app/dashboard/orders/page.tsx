"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Filter, Eye, Download, RefreshCw } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }[]
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    pincode: string
  }
  trackingNumber?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "NR-2024-001",
        date: "2024-12-15",
        status: "delivered",
        total: 25000,
        items: [
          {
            id: "1",
            name: "Premium Memory Foam Mattress",
            quantity: 1,
            price: 25000,
            image: "/placeholder.jpg"
          }
        ],
        shippingAddress: {
          name: "John Doe",
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001"
        },
        trackingNumber: "TRK123456789"
      },
      {
        id: "2",
        orderNumber: "NR-2024-002",
        date: "2024-12-10",
        status: "shipped",
        total: 18000,
        items: [
          {
            id: "2",
            name: "Orthopedic Mattress",
            quantity: 1,
            price: 18000,
            image: "/placeholder.jpg"
          }
        ],
        shippingAddress: {
          name: "John Doe",
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001"
        },
        trackingNumber: "TRK987654321"
      },
      {
        id: "3",
        orderNumber: "NR-2024-003",
        date: "2024-12-05",
        status: "processing",
        total: 32000,
        items: [
          {
            id: "3",
            name: "Luxury Hybrid Mattress",
            quantity: 1,
            price: 32000,
            image: "/placeholder.jpg"
          }
        ],
        shippingAddress: {
          name: "John Doe",
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001"
        }
      }
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "processing":
        return "Processing"
      case "shipped":
        return "Shipped"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">My Orders</h1>
        <p className="text-lg text-slate-600 mt-2">Track and manage your mattress orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search orders or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border-blue-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-blue-700">Order #{order.orderNumber}</CardTitle>
                    <CardDescription>Placed on {formatDate(order.date)}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-900">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Items Ordered</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg">
                          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Shipping Address</h4>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p className="text-slate-600">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Tracking Information</h4>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Tracking Number: <span className="font-mono font-medium">{order.trackingNumber}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                    <Button variant="outline" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === "delivered" && (
                      <Button variant="outline" className="bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    )}
                    {order.status === "shipped" && (
                      <Button variant="outline" className="bg-transparent">
                        Track Package
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-blue-200">
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No orders found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || statusFilter !== "all" 
                ? "No orders match your current filters." 
                : "You haven't placed any orders yet."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => window.location.href = "/products"}>
                Start Shopping
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
