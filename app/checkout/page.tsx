"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Truck, Shield, Clock } from "lucide-react"

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [processingFee] = useState(0)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",

    // Additional Options
    deliveryInstructions: "",
    agreeToTerms: true,
    subscribeNewsletter: false,
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    setIsLoading(true)

    try {
      // Create order first
      const orderData = {
        userId: user?.id || "guest",
        userEmail: formData.email,
        userName: `${formData.firstName} ${formData.lastName}`,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          size: item.size,
          firmness: item.firmness,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total + processingFee,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        paymentMethod: "cod",
      }

      // Get authentication token
      const token = typeof window !== "undefined" ? localStorage.getItem("nexa_rest_token") || localStorage.getItem("accessToken") : null

      // Create order via API
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(orderData),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const createdOrder = await orderResponse.json()
      const createdOrderId: string = createdOrder?.data?.id
      if (!createdOrderId) {
        throw new Error("Invalid order response")
      }

      // Submit lead data to external leads API
      const leadData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        deliveryInstructions: formData.deliveryInstructions,
        subscribeNewsletter: formData.subscribeNewsletter,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          size: item.size,
          firmness: item.firmness,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total + processingFee,
        orderId: createdOrderId,
      }

      // Submit to external leads API
      try {
        const leadsResponse = await fetch("http://localhost:8000/api/leads", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify(leadData),
        })

        if (leadsResponse.ok) {
          const leadsResult = await leadsResponse.json()
          console.log("Lead submitted successfully:", leadsResult)
        } else {
          const errorData = await leadsResponse.json().catch(() => ({}))
          console.warn("Failed to submit lead data:", leadsResponse.status, errorData)
        }
      } catch (leadsError) {
        console.warn("Leads API error:", leadsError)
        // Don't break the order flow if leads submission fails
      }

      // Clear cart and redirect to home
      clearCart()
      router.push("/")
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const steps = [{ id: 1, name: "Shipping", icon: Truck }]

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
            <p className="text-slate-600">Complete your order</p>
          </div>
        </div>

        {/* Shipping step only */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-600 text-white">
                <Truck className="h-5 w-5" />
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Shipping</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address, apartment, suite, etc."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                      <Textarea
                        id="deliveryInstructions"
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for delivery..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="subscribeNewsletter"
                        name="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="subscribeNewsletter" className="text-sm text-slate-600">
                        Subscribe to our newsletter for updates and offers
                      </Label>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Submit & Place Order"}
                    </Button>
                  </CardContent>
                </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    {processingFee > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Processing Fee</span>
                        <span>{formatPrice(processingFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Tax (18% GST)</span>
                      <span>{formatPrice((total + processingFee) * 0.18)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold text-slate-900">
                    <span>Total</span>
                    <span>{formatPrice((total + processingFee) * 1.18)}</span>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Secure SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Free delivery & setup</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span>100-night sleep trial</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
