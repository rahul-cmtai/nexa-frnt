"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Star, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const products = [
    {
      id: 1,
      name: "Nexa Cloud Memory Foam",
      description: "Experience unparalleled comfort with our premium memory foam mattress. Designed for the perfect night's sleep, every night.",
      originalPrice: 89999,
      salePrice: 59999,
      rating: 4.8,
      reviews: 1247,
      image: "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
      badge: "Best Seller",
      features: ["Cooling Gel", "Memory Foam", "Medium Firm"]
    },
    {
      id: 2,
      name: "Nexa Hybrid Luxury",
      description: "Luxury meets innovation with our hybrid mattress combining pocket springs and premium materials for ultimate comfort.",
      originalPrice: 119999,
      salePrice: 89999,
      rating: 4.9,
      reviews: 892,
      image: "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
      badge: "Premium",
      features: ["Pocket Springs", "Latex Top", "Firm Support"]
    },
    {
      id: 3,
      name: "Nexa Ortho Plus",
      description: "Orthopedic support designed for spinal alignment and pressure relief. Perfect for those who need extra support.",
      originalPrice: 69999,
      salePrice: 49999,
      rating: 4.7,
      reviews: 634,
      image: "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      badge: "Ortho Care",
      features: ["Orthopedic", "Firm Support", "Spinal Alignment"]
    },
    {
      id: 4,
      name: "Nexa Soft Comfort",
      description: "Plush comfort that cradles you to sleep. Our softest mattress for those who love a cloud-like feel.",
      originalPrice: 79999,
      salePrice: 54999,
      rating: 4.6,
      reviews: 456,
      image: "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
      badge: "Comfort Plus",
      features: ["Plush Top", "Memory Foam", "Soft Support"]
    },
    {
      id: 5,
      name: "Nexa Natural Latex",
      description: "100% natural latex mattress for eco-conscious sleepers. Breathable, hypoallergenic, and incredibly comfortable.",
      originalPrice: 139999,
      salePrice: 99999,
      rating: 4.8,
      reviews: 321,
      image: "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
      badge: "Eco-Friendly",
      features: ["100% Natural Latex", "Organic Cotton", "Breathable"]
    },
    {
      id: 6,
      name: "Nexa Cool Breeze",
      description: "Advanced cooling technology keeps you comfortable all night long. Perfect for hot sleepers.",
      originalPrice: 94999,
      salePrice: 69999,
      rating: 4.7,
      reviews: 789,
      image: "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      badge: "Cooling Tech",
      features: ["Advanced Cooling", "Gel Infused", "Temperature Control"]
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [products.length])

  const currentProduct = products[currentSlide]

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image - Product Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentProduct.image}
          alt={`${currentProduct.name} mattress`}
          fill
          className="object-cover transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-blue-500/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-secondary text-secondary-foreground inline-block">
            {currentProduct.badge}
          </Badge>
          
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 text-balance">
            {currentProduct.name}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto text-pretty">
            {currentProduct.description}
          </p>

          {/* Rating */}
          {/* <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(currentProduct.rating) ? "fill-secondary text-secondary" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-white/80">
              {currentProduct.rating} ({currentProduct.reviews} reviews)
            </span>
          </div> */}

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {currentProduct.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="border-white/30 text-white/90">
                {feature}
              </Badge>
            ))}
          </div>

          {/* Price */}
          {/* <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-3xl font-bold text-secondary">₹{currentProduct.salePrice.toLocaleString()}</span>
            <span className="text-lg text-white/60 line-through">
              ₹{currentProduct.originalPrice.toLocaleString()}
            </span>
            <Badge variant="destructive" className="text-sm">
              {Math.round(((currentProduct.originalPrice - currentProduct.salePrice) / currentProduct.originalPrice) * 100)}% OFF
            </Badge>
          </div> */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg bg-transparent"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Our Story
            </Button>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">100</div>
              <div className="text-sm text-white/80">Night Trial</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">10</div>
              <div className="text-sm text-white/80">Year Warranty</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">Free</div>
              <div className="text-sm text-white/80">Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-secondary w-8" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
