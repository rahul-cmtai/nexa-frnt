"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"

export function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "The Nexa Cloud Memory Foam has completely transformed my sleep. I wake up refreshed and pain-free every morning. Best investment I've made for my health!",
      avatar: "/indian-woman-smiling.png",
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      text: "After years of back pain, the Nexa Ortho Plus has been a game-changer. The support is incredible and the quality is outstanding. Highly recommended!",
      avatar: "/indian-professional-man.png",
    },
    {
      name: "Anita Patel",
      location: "Bangalore",
      rating: 5,
      text: "The cooling technology in the Nexa Hybrid Luxury is amazing. No more tossing and turning from overheating. Perfect for Bangalore's climate!",
      avatar: "/indian-woman-professional.png",
    },
    {
      name: "Vikram Singh",
      location: "Pune",
      rating: 5,
      text: "Excellent customer service and product quality. The 100-night trial gave me confidence to try it, and I'm so glad I did. Worth every rupee!",
      avatar: "/indian-man-smiling.png",
    },
    {
      name: "Sneha Reddy",
      location: "Hyderabad",
      rating: 5,
      text: "The Nexa Natural Latex is perfect for my allergies. Pure, natural, and incredibly comfortable. I sleep like a baby every night!",
      avatar: "/indian-woman-smiling.png",
    },
    {
      name: "Arjun Mehta",
      location: "Chennai",
      rating: 5,
      text: "Best mattress I've ever owned. The cooling technology keeps me comfortable even in Chennai's heat. Worth every penny!",
      avatar: "/indian-professional-man.png",
    },
  ]

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Join thousands of satisfied customers who have transformed their sleep with Nexa Rest mattresses.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -100 * duplicatedTestimonials.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 12,
                ease: "linear",
              },
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                className="flex-shrink-0 w-96"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5 h-full">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-primary/30 mb-4" />

                    <div className="mb-6">
                      <p className="text-lg text-foreground/90 leading-relaxed text-pretty">
                        "{testimonial.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-base">{testimonial.name}</div>
                        <div className="text-muted-foreground text-sm">{testimonial.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
