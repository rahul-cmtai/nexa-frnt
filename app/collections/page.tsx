"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function CollectionsPage() {
  const collections = [
    {
      id: 1,
      name: "Bed Mattresses",
      description: "Premium mattresses for every sleep preference",
      image: "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
      productCount: 12,
      href: "/products?category=mattresses",
    },
    {
      id: 2,
      name: "Beds",
      description: "Stylish bed frames and bases",
      image: "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
      productCount: 8,
      href: "/products?category=beds",
    },
    {
      id: 3,
      name: "Mattress Protectors",
      description: "Protect your investment with quality covers",
      image: "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      productCount: 6,
      href: "/products?category=protectors",
    },
    {
      id: 4,
      name: "Pillows",
      description: "Comfortable pillows for perfect neck support",
      image: "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
      productCount: 15,
      href: "/products?category=pillows",
    },
    {
      id: 5,
      name: "Memory Foam Mattress",
      description: "Advanced memory foam technology",
      image: "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
      productCount: 5,
      href: "/products?category=memory-foam",
    },
    {
      id: 6,
      name: "Ortho Mattress",
      description: "Orthopedic support for better spine alignment",
      image: "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      productCount: 7,
      href: "/products?category=ortho",
    },
    {
      id: 7,
      name: "Custom Mattress",
      description: "Made-to-order mattresses for unique needs",
      image: "/luxury-hybrid-mattress-with-pocket-springs-and-m.jpg",
      productCount: 3,
      href: "/products?category=custom",
    },
    {
      id: 8,
      name: "Luxury Mattress",
      description: "Premium luxury sleep experience",
      image: "/premium-memory-foam-mattress-with-cooling-gel-lay.jpg",
      productCount: 4,
      href: "/products?category=luxury",
    },
    {
      id: 9,
      name: "Firm Mattress",
      description: "Extra firm support for back sleepers",
      image: "/orthopedic-mattress-with-firm-support-and-spinal.jpg",
      productCount: 6,
      href: "/products?category=firm",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Collections</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Explore our curated collections of premium mattresses and sleep accessories, designed to meet every sleep
            preference and lifestyle need.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link key={collection.id} href={collection.href}>
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                    <h3 className="font-playfair text-2xl font-bold mb-2 text-center">{collection.name}</h3>
                    <p className="text-center text-white/90 mb-4">{collection.description}</p>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {collection.productCount} Products
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Featured Collection */}
        <div className="mt-16">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-[4/3] lg:aspect-auto">
                <Image
                  src="/luxury-bedroom-with-premium-mattress--modern-minim.jpg"
                  alt="Featured Collection"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-secondary text-secondary-foreground">Featured Collection</Badge>
                <h2 className="font-playfair text-3xl font-bold mb-4">Premium Sleep Experience</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Discover our most luxurious mattresses, crafted with the finest materials and advanced sleep
                  technology for the ultimate comfort experience.
                </p>
                <div className="flex gap-4">
                  <Link href="/products?featured=true" className="inline-block">
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Shop Featured
                    </button>
                  </Link>
                  <Link href="/about" className="inline-block">
                    <button className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors">
                      Learn More
                    </button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
