import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      slug: "best-sleep-positions-for-back-pain",
      title: "Best Sleep Positions for Back Pain Relief",
      excerpt:
        "Discover the optimal sleeping positions that can help alleviate back pain and improve your sleep quality.",
      image: "/person-sleeping-comfortably-on-mattress.jpg",
      author: "Dr. Priya Sharma",
      date: "2024-01-15",
      category: "Health & Wellness",
      readTime: "5 min read",
    },
    {
      id: 2,
      slug: "choosing-right-mattress-firmness",
      title: "How to Choose the Right Mattress Firmness",
      excerpt:
        "Learn about different mattress firmness levels and how to select the perfect one for your sleeping style.",
      image: "/different-mattress-firmness-levels-comparison.jpg",
      author: "Rajesh Kumar",
      date: "2024-01-10",
      category: "Mattress Guide",
      readTime: "7 min read",
    },
    {
      id: 3,
      slug: "sleep-hygiene-tips-better-rest",
      title: "10 Sleep Hygiene Tips for Better Rest",
      excerpt: "Simple yet effective tips to improve your sleep hygiene and get the quality rest you deserve.",
      image: "/peaceful-bedroom-setup-for-good-sleep.jpg",
      author: "Dr. Anita Verma",
      date: "2024-01-05",
      category: "Sleep Tips",
      readTime: "6 min read",
    },
    {
      id: 4,
      slug: "memory-foam-vs-spring-mattress",
      title: "Memory Foam vs Spring Mattress: Which is Better?",
      excerpt:
        "A comprehensive comparison between memory foam and spring mattresses to help you make the right choice.",
      image: "/memory-foam-and-spring-mattress-comparison.jpg",
      author: "Vikram Singh",
      date: "2023-12-28",
      category: "Mattress Guide",
      readTime: "8 min read",
    },
    {
      id: 5,
      slug: "importance-of-quality-sleep",
      title: "The Science Behind Quality Sleep",
      excerpt: "Understanding the importance of quality sleep and its impact on your physical and mental health.",
      image: "/brain-activity-during-sleep-scientific-illustratio.jpg",
      author: "Dr. Meera Patel",
      date: "2023-12-20",
      category: "Health & Wellness",
      readTime: "10 min read",
    },
    {
      id: 6,
      slug: "mattress-care-maintenance-tips",
      title: "Essential Mattress Care and Maintenance Tips",
      excerpt: "Learn how to properly care for your mattress to extend its lifespan and maintain optimal comfort.",
      image: "/person-cleaning-and-maintaining-mattress.jpg",
      author: "Suresh Gupta",
      date: "2023-12-15",
      category: "Mattress Care",
      readTime: "5 min read",
    },
  ]

  const categories = ["All", "Health & Wellness", "Mattress Guide", "Sleep Tips", "Mattress Care"]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Sleep Better, Live Better</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto text-pretty">
            Expert insights, tips, and guides to help you achieve the perfect night's sleep
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3 text-balance">
                    <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </a>
                  </h2>
                  <p className="text-gray-600 mb-4 text-pretty">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest sleep tips, mattress guides, and exclusive offers.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
