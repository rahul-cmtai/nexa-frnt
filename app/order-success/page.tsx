"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, Calendar, ArrowRight, CreditCard, Smartphone, Banknote } from "lucide-react"

export default function OrderSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const orderId = searchParams.get("orderId")
  const paymentId = searchParams.get("paymentId")

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0)

    // In a real app, you would fetch order details from API
    if (orderId) {
      setOrderDetails({
        orderId,
        paymentId,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        paymentMethod: paymentId ? (paymentId.startsWith("upi_") ? "UPI" : "Card") : "Cash on Delivery",
      })
    }
  }, [orderId, paymentId])

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "UPI":
        return <Smartphone className="h-5 w-5 text-blue-600" />
      case "Card":
        return <CreditCard className="h-5 w-5 text-green-600" />
      case "Cash on Delivery":
        return <Banknote className="h-5 w-5 text-orange-600" />
      default:
        return <CreditCard className="h-5 w-5 text-slate-600" />
    }
  }

  const getPaymentStatus = (method: string) => {
    if (method === "Cash on Delivery") {
      return { text: "Pending", color: "bg-orange-100 text-orange-800" }
    }
    return { text: "Paid", color: "bg-green-100 text-green-800" }
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  const paymentStatus = getPaymentStatus(orderDetails.paymentMethod)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <CardContent className="p-8">
            {/* Success Icon */}
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
              <p className="text-slate-600">Thank you for choosing Nexa Rest for your sleep journey</p>
            </div>

            {/* Order Details */}
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm font-medium text-slate-700">Order Number</p>
                  <p className="text-lg font-semibold text-slate-900">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Estimated Delivery</p>
                  <p className="text-lg font-semibold text-slate-900">{orderDetails.estimatedDelivery}</p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(orderDetails.paymentMethod)}
                    <span className="font-medium text-slate-700">Payment Method</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">{orderDetails.paymentMethod}</span>
                    <Badge className={paymentStatus.color}>{paymentStatus.text}</Badge>
                  </div>
                </div>
                {orderDetails.paymentId && (
                  <div className="mt-2 text-sm text-slate-600">Transaction ID: {orderDetails.paymentId}</div>
                )}
              </div>
            </div>

            {/* What's Next */}
            <div className="text-left mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">What happens next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Order Processing</p>
                    <p className="text-sm text-slate-600">
                      We'll prepare your mattress and schedule delivery within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Free Delivery & Setup</p>
                    <p className="text-sm text-slate-600">
                      Our team will deliver and set up your mattress at no extra cost
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">100-Night Sleep Trial</p>
                    <p className="text-sm text-slate-600">
                      Try your mattress for 100 nights. Not satisfied? We'll pick it up for free
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                📧 A confirmation email with tracking details has been sent to your email address
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                View Order Status
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button variant="outline" onClick={() => router.push("/products")} className="w-full">
                Continue Shopping
              </Button>
            </div>

            {/* Support */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-slate-600 mb-2">Need help with your order?</p>
              <Button variant="link" className="text-blue-600 hover:text-blue-700">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
