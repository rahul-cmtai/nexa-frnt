import { Hero } from "@/components/sections/hero"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { TrustBadges } from "@/components/sections/trust-badges"
import { WhyChooseUs } from "@/components/sections/why-choose-us"
import { Testimonials } from "@/components/sections/testimonials"
import { BlogPreview } from "@/components/sections/blog-preview"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroCarousel } from "@/components/sections/hero-carousel"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* <Hero /> */}
        <HeroCarousel />
        <TrustBadges />
        <FeaturedProducts />
        <WhyChooseUs />
        <Testimonials />
        <BlogPreview />
      </main>
      <Footer />
    </div>
  )
}
