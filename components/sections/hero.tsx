import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/luxury-bedroom-with-premium-mattress--modern-minim.jpg"
          alt="Luxury bedroom with Nexa Rest mattress"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 text-balance">
            Next Level of <span className="text-secondary">Sleep</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto text-pretty">
            Experience unparalleled comfort with our premium mattresses. Designed for the perfect night's sleep, every
            night.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Shop Mattresses
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
    </section>
  )
}
