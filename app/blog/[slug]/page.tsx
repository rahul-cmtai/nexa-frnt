import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface BlogPost {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  date: string
  category: string
  readTime: string
  tags: string[]
}

// Mock blog posts data
const blogPosts: BlogPost[] = [
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
    tags: ["back pain", "sleep positions", "health", "wellness"],
    content: `
      <p>Back pain affects millions of people worldwide, and poor sleep posture can significantly worsen the condition. The right sleeping position can make a dramatic difference in your comfort level and overall sleep quality.</p>
      
      <h2>The Best Sleep Positions for Back Pain</h2>
      
      <h3>1. Sleeping on Your Back</h3>
      <p>Sleeping on your back is often considered the best position for back pain relief. This position helps maintain the natural curve of your spine and distributes your body weight evenly.</p>
      <ul>
        <li>Place a pillow under your knees to maintain the natural curve of your lower back</li>
        <li>Use a supportive pillow for your head that keeps your neck aligned</li>
        <li>Consider a small rolled towel under your lower back for additional support</li>
      </ul>
      
      <h3>2. Side Sleeping (Fetal Position)</h3>
      <p>Side sleeping can be beneficial for back pain, especially when done correctly. The fetal position can help open up the joints in your spine.</p>
      <ul>
        <li>Sleep on your side with your knees drawn up slightly toward your chest</li>
        <li>Place a pillow between your knees to keep your hips aligned</li>
        <li>Switch sides occasionally to prevent muscle imbalances</li>
      </ul>
      
      <h3>3. What to Avoid</h3>
      <p>Stomach sleeping is generally not recommended for people with back pain as it can strain your neck and lower back.</p>
      
      <h2>Choosing the Right Mattress</h2>
      <p>Your mattress plays a crucial role in supporting proper sleep posture. A medium-firm mattress typically provides the best support for most people with back pain.</p>
      
      <h2>Additional Tips</h2>
      <ul>
        <li>Maintain good posture during the day</li>
        <li>Strengthen your core muscles</li>
        <li>Stay active with regular exercise</li>
        <li>Consider seeing a healthcare professional for persistent pain</li>
      </ul>
      
      <p>Remember, what works best can vary from person to person. It may take some time to find the perfect sleeping position and setup that works for your specific needs.</p>
    `,
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
    tags: ["mattress", "firmness", "sleep quality", "buying guide"],
    content: `
      <p>Choosing the right mattress firmness is crucial for getting quality sleep and maintaining proper spinal alignment. With so many options available, it can be overwhelming to decide which firmness level is right for you.</p>
      
      <h2>Understanding Mattress Firmness Scale</h2>
      <p>Mattress firmness is typically rated on a scale of 1-10, where 1 is extremely soft and 10 is extremely firm:</p>
      <ul>
        <li><strong>1-2 (Very Soft):</strong> Deep sinking, plush feel</li>
        <li><strong>3-4 (Soft):</strong> Noticeable sinking, contouring</li>
        <li><strong>5-6 (Medium):</strong> Balanced support and comfort</li>
        <li><strong>7-8 (Firm):</strong> Minimal sinking, strong support</li>
        <li><strong>9-10 (Very Firm):</strong> Very little give, maximum support</li>
      </ul>
      
      <h2>Factors to Consider</h2>
      
      <h3>Sleep Position</h3>
      <ul>
        <li><strong>Side Sleepers:</strong> Soft to medium (3-6) for pressure relief</li>
        <li><strong>Back Sleepers:</strong> Medium to firm (5-7) for spinal support</li>
        <li><strong>Stomach Sleepers:</strong> Firm (6-8) to prevent sinking</li>
      </ul>
      
      <h3>Body Weight</h3>
      <ul>
        <li><strong>Under 130 lbs:</strong> Softer mattresses (3-5)</li>
        <li><strong>130-230 lbs:</strong> Medium firmness (5-7)</li>
        <li><strong>Over 230 lbs:</strong> Firmer mattresses (7-9)</li>
      </ul>
      
      <h3>Health Conditions</h3>
      <ul>
        <li><strong>Back Pain:</strong> Medium-firm (6-7) typically recommended</li>
        <li><strong>Hip Pain:</strong> Softer mattresses (4-6) for pressure relief</li>
        <li><strong>Joint Issues:</strong> Medium (5-6) for balance of support and comfort</li>
      </ul>
      
      <h2>Testing Your Mattress</h2>
      <p>Most reputable mattress companies offer sleep trials ranging from 90-365 nights. Take advantage of these trials to ensure the firmness is right for you.</p>
      
      <h2>Final Recommendations</h2>
      <p>When in doubt, medium-firm (6-7) mattresses work well for most people as they provide a good balance of support and comfort. Remember, personal preference plays a significant role, so what works for others may not work for you.</p>
    `,
  },
]

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="aspect-[21/9] overflow-hidden">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 text-white/80 mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">{post.category}</span>
                <span>{post.readTime}</span>
                <span>{new Date(post.date).toLocaleDateString("en-IN")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{post.title}</h1>
              <p className="text-xl text-white/90 text-pretty">{post.excerpt}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-gray-600 text-sm">Sleep Expert & Health Writer</p>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {relatedPost.category}
                        </span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 text-balance">
                        <a href={`/blog/${relatedPost.slug}`} className="hover:text-blue-600 transition-colors">
                          {relatedPost.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 text-sm text-pretty">{relatedPost.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Better Sleep?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore our premium mattress collection designed for optimal comfort and support.
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Mattresses
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
