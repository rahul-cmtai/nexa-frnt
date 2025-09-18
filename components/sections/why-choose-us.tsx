import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Zap, Users, Microscope } from "lucide-react"

export function WhyChooseUs() {
  const features = [
    {
      icon: Microscope,
      title: "Advanced Sleep Technology",
      description:
        "Our mattresses incorporate cutting-edge materials and design innovations to optimize your sleep quality and comfort.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Materials",
      description:
        "We use sustainable, non-toxic materials that are safe for you and the environment, without compromising on quality.",
    },
    {
      icon: Zap,
      title: "Temperature Regulation",
      description:
        "Advanced cooling technology keeps you comfortable all night long, preventing overheating for uninterrupted sleep.",
    },
    {
      icon: Users,
      title: "Personalized Comfort",
      description:
        "Multiple firmness options and customizable features ensure the perfect match for your unique sleep preferences.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Engineered for <span className="text-primary">Perfect Sleep</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              At Nexa Rest, we combine scientific research with premium craftsmanship to create mattresses that
              transform your sleep experience. Every detail is designed with your comfort in mind.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="/cross-section-view-of-premium-mattress-layers-sh.jpg"
                alt="Mattress technology cross-section"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm opacity-90">Years of Innovation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
