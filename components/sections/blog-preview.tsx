import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function BlogPreview() {
  const articles = [
    {
      id: 1,
      title: "The Science of Sleep: How Your Mattress Affects Sleep Quality",
      excerpt: "Discover the connection between mattress quality and sleep health, backed by scientific research.",
      image: "/sleep-science-research-laboratory-with-modern-eq.jpg",
      category: "Sleep Science",
      date: "2024-01-15",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Choosing the Right Firmness: A Complete Guide",
      excerpt: "Learn how to select the perfect mattress firmness based on your sleep position and preferences.",
      image: "/mattress-firmness-comparison-showing-different.jpg",
      category: "Buying Guide",
      date: "2024-01-10",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "Sleep Hygiene Tips for Better Rest",
      excerpt: "Simple habits and practices that can significantly improve your sleep quality and overall health.",
      image: "/peaceful-bedroom-setup-with-optimal-sleep-hygie.jpg",
      category: "Sleep Tips",
      date: "2024-01-05",
      readTime: "4 min read",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Sleep Better, Live Better</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Explore our expert guides and tips to optimize your sleep experience and improve your overall well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{article.category}</Badge>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="font-playfair text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-muted-foreground mb-4 text-pretty">{article.excerpt}</p>

                <Button asChild variant="ghost" className="p-0 h-auto font-semibold group">
                  <Link href={`/blog/${article.id}`}>
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/blog">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
