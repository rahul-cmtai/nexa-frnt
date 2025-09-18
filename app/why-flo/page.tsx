"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Shield, Award, Truck, RotateCcw, Heart, CheckCircle, Zap } from "lucide-react"

export default function WhyFloPage() {
  const benefits = [
    {
      icon: Shield,
      title: "10-Year Warranty",
      description: "Comprehensive coverage for manufacturing defects and material issues",
      color: "text-blue-600",
    },
    {
      icon: RotateCcw,
      title: "100-Night Trial",
      description: "Try your mattress at home risk-free for over 3 months",
      color: "text-green-600",
    },
    {
      icon: Truck,
      title: "Free Delivery & Setup",
      description: "Complimentary white-glove delivery and professional setup",
      color: "text-purple-600",
    },
    {
      icon: Award,
      title: "Premium Materials",
      description: "CertiPUR-US certified foams and eco-friendly materials",
      color: "text-orange-600",
    },
    {
      icon: Zap,
      title: "Advanced Technology",
      description: "Cooling gel, memory foam, and pressure-relieving innovations",
      color: "text-red-600",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "98% customer satisfaction with dedicated support team",
      color: "text-pink-600",
    },
  ]

  const features = [
    {
      title: "Unparalleled Spine Support",
      description:
        "Our mattresses are designed with Stress Release™ technology that minimizes painful pressure points, ensuring your spine stays aligned throughout the night.",
      image: "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
    },
    {
      title: "Keeps You Cool",
      description:
        "Our foams are infused with white gel micro-capsules and graphite particles that actively draw heat away from your body via our 3D Air-Flo™ technology.",
      image: "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
    },
    {
      title: "Aloe Vera-Infused Cover",
      description:
        "Our zippered, high quality cashmere fabric cover has been specially treated with aloe vera gel that keeps your skin looking hydrated and youthful.",
      image: "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
    },
  ]

  const mattressOptions = [
    {
      name: "Ergo™",
      description: "For those who prefer either ergonomic support. This is our most preferred variant.",
      firmness: "Medium Firm",
      price: "₹59,999",
      image: "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
    },
    {
      name: "Ortho™",
      description:
        "For those who prefer harder orthopedic support. This is better suited for those who need extra back support.",
      firmness: "Firm",
      price: "₹64,999",
      image: "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 to-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-secondary text-secondary-foreground">Why Choose Nexa Rest</Badge>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Unlock Your Deepest Sleep, or Get 100% Refund
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty mb-8">
                Experience the best sleep starting at ₹9 per night. We designed our mattresses keeping in mind the
                features that people in India care about the most.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Shop Mattresses
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center items-center gap-8 mb-12 opacity-60">
              <div className="text-center">
                <div className="text-sm font-medium">Zero % EMI available</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">HDFC Bank</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">ICICI Bank</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">SBI</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Why 50,000+ Customers Choose Us</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                We go beyond just selling mattresses - we provide a complete sleep experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-50`}>
                      <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Go with the Flo ~</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                We designed our mattresses keeping in mind the features that people in India care about the most.
              </p>
            </div>

            <div className="space-y-20">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
                >
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg mb-6">{feature.description}</p>
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Clinically tested and proven</span>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                      <Image
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mattress Options */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Choose from 4 Amazing Options</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                We designed our mattresses keeping in mind features people in India care about the most.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {mattressOptions.map((mattress, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={mattress.image || "/placeholder.svg"}
                      alt={mattress.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-playfair text-2xl font-bold">{mattress.name}</h3>
                      <Badge variant="secondary">{mattress.firmness}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{mattress.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{mattress.price}</span>
                      <Button>Shop Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the Next Level of Sleep?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-pretty">
              Join thousands of satisfied customers who have transformed their sleep with our premium mattresses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100">
                Shop Mattresses
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                100-Night Trial
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
