// Payment utilities and mock payment gateway integration
export interface PaymentDetails {
  amount: number
  currency: string
  orderId: string
  customerEmail: string
  customerName: string
  customerPhone: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  orderId: string
  amount: number
  status: "success" | "failed" | "pending"
  error?: string
  transactionId?: string
}

export interface UPIPaymentDetails {
  upiId: string
  amount: number
  orderId: string
}

// Mock payment gateway service (simulates Razorpay/Stripe)
export const paymentService = {
  // Process card payment
  async processCardPayment(
    paymentDetails: PaymentDetails,
    cardDetails: {
      cardNumber: string
      expiryDate: string
      cvv: string
      nameOnCard: string
    },
  ): Promise<PaymentResult> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock validation
    const { cardNumber, expiryDate, cvv } = cardDetails

    // Simulate payment failure for specific test cases
    if (cardNumber === "4000000000000002") {
      return {
        success: false,
        orderId: paymentDetails.orderId,
        amount: paymentDetails.amount,
        status: "failed",
        error: "Your card was declined. Please try a different payment method.",
      }
    }

    if (cvv === "000") {
      return {
        success: false,
        orderId: paymentDetails.orderId,
        amount: paymentDetails.amount,
        status: "failed",
        error: "Invalid CVV. Please check your card details.",
      }
    }

    // Simulate successful payment
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      success: true,
      paymentId,
      orderId: paymentDetails.orderId,
      amount: paymentDetails.amount,
      status: "success",
      transactionId,
    }
  },

  // Process UPI payment
  async processUPIPayment(upiDetails: UPIPaymentDetails): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock UPI validation
    if (!upiDetails.upiId.includes("@")) {
      return {
        success: false,
        orderId: upiDetails.orderId,
        amount: upiDetails.amount,
        status: "failed",
        error: "Invalid UPI ID format",
      }
    }

    const transactionId = `upi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      success: true,
      orderId: upiDetails.orderId,
      amount: upiDetails.amount,
      status: "success",
      transactionId,
    }
  },

  // Process Cash on Delivery
  async processCODPayment(orderId: string, amount: number): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      orderId,
      amount,
      status: "pending", // COD is pending until delivery
      transactionId: `cod_${Date.now()}`,
    }
  },

  // Verify payment status
  async verifyPayment(paymentId: string): Promise<{ verified: boolean; status: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock verification - in real app, this would call payment gateway API
    return {
      verified: true,
      status: "captured",
    }
  },

  // Get payment methods available
  getPaymentMethods() {
    return [
      {
        id: "card",
        name: "Credit/Debit Card",
        description: "Visa, Mastercard, RuPay",
        icon: "💳",
        enabled: true,
      },
      {
        id: "upi",
        name: "UPI Payment",
        description: "Google Pay, PhonePe, Paytm",
        icon: "📱",
        enabled: true,
      },
      {
        id: "netbanking",
        name: "Net Banking",
        description: "All major banks supported",
        icon: "🏦",
        enabled: false, // Disabled for demo
      },
      {
        id: "wallet",
        name: "Digital Wallet",
        description: "Paytm, Amazon Pay",
        icon: "👛",
        enabled: false, // Disabled for demo
      },
      {
        id: "cod",
        name: "Cash on Delivery",
        description: "Pay when you receive",
        icon: "💵",
        enabled: true,
      },
    ]
  },

  // Calculate processing fee
  calculateProcessingFee(amount: number, method: string): number {
    switch (method) {
      case "card":
        return Math.round(amount * 0.02) // 2% for cards
      case "upi":
        return 0 // Free for UPI
      case "netbanking":
        return Math.round(amount * 0.015) // 1.5% for net banking
      case "wallet":
        return Math.round(amount * 0.01) // 1% for wallets
      case "cod":
        return 50 // Flat ₹50 for COD
      default:
        return 0
    }
  },
}
