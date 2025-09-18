import { Shield, Truck, RotateCcw, Award, Clock, HeadphonesIcon } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: RotateCcw,
      title: "100-Night Trial",
      description: "Sleep on it risk-free",
    },
    {
      icon: Shield,
      title: "10-Year Warranty",
      description: "Long-lasting quality guarantee",
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Complimentary white-glove service",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence",
    },
    {
      icon: Clock,
      title: "Quick Setup",
      description: "Ready to sleep in minutes",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Always here to help",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Why Choose Nexa Rest?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            We're committed to providing you with the best sleep experience through quality, service, and trust.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <badge.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-sm">{badge.title}</h3>
              <p className="text-xs text-muted-foreground text-pretty">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
