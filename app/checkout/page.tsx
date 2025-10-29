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
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
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
    if (items.length === 0 && !showThankYou) {
      router.push("/cart")
    }
  }, [items.length, showThankYou, router])

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
      // Get authentication token
      const token = typeof window !== "undefined" ? localStorage.getItem("nexa_rest_token") || localStorage.getItem("accessToken") : null

      // Submit lead data to external orders-leads API
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
        // orderId intentionally omitted because orders are not created here
        source: "checkout_form",
        notes: "",
      }

      // Submit to external orders-leads API
      try {
        const leadsResponse = await fetch(`${API_BASE}/api/v1/orders-leads`, {
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
          // Show thank you, then clear cart and redirect
          setShowThankYou(true)
          clearCart()
          setTimeout(() => {
            router.push("/")
          }, 3000)
        } else {
          const errorData = await leadsResponse.json().catch(() => ({}))
          console.warn("Failed to submit lead data:", leadsResponse.status, errorData)
          throw new Error(errorData?.message || "Failed to submit lead data")
        }
      } catch (leadsError) {
        console.warn("Leads API error:", leadsError)
        throw leadsError
      }
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

  if (items.length === 0 && !showThankYou) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 via-blue-500/70 to-yellow-400/70" />
          <div className="absolute inset-0 backdrop-blur-sm" />

          {/* simple confetti */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="confetti" style={{ left: "12%", animationDelay: "0s" }} />
            <span className="confetti" style={{ left: "28%", animationDelay: ".15s" }} />
            <span className="confetti" style={{ left: "44%", animationDelay: ".3s" }} />
            <span className="confetti" style={{ left: "60%", animationDelay: ".45s" }} />
            <span className="confetti" style={{ left: "76%", animationDelay: ".6s" }} />
            <span className="confetti" style={{ left: "88%", animationDelay: ".75s" }} />
          </div>

          <div className="relative mx-auto max-w-md scale-in rounded-2xl bg-white/95 p-8 text-center shadow-2xl ring-1 ring-black/5">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-blue-100 shadow-inner">
              <span className="text-5xl leading-none animate-bounce-slow" role="img" aria-label="thank you">🙏</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Thank you for your order!</h2>
            <p className="mt-2 text-slate-600">We truly appreciate it. Redirecting you home…</p>
          </div>

          <style jsx>{`
            .scale-in { animation: popIn 380ms cubic-bezier(.18,.89,.32,1.28) both; }
            @keyframes popIn { 0% { transform: scale(.8); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
            .animate-bounce-slow { animation: bounce 1.8s infinite; }
            @keyframes bounce { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
            .confetti { position: absolute; top: -10%; width: 10px; height: 14px; border-radius: 2px; animation: fall 2.2s linear infinite; }
            .confetti:nth-child(1){ background:#3b82f6 }
            .confetti:nth-child(2){ background:#60a5fa }
            .confetti:nth-child(3){ background:#2563eb }
            .confetti:nth-child(4){ background:#facc15 }
            .confetti:nth-child(5){ background:#f59e0b }
            .confetti:nth-child(6){ background:#fde047 }
            @keyframes fall { 0% { transform: translateY(-10%) rotate(0deg) } 100% { transform: translateY(120vh) rotate(360deg) } }
          `}</style>
        </div>
      )}
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
