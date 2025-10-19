"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowLeft, Share2, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const blogPosts = {
  "1": {
    id: 1,
    title: "10 Essential Wedding Planning Tips for 2024",
    content: `
      <p>Planning a wedding can be overwhelming, but with the right approach, it can also be one of the most exciting experiences of your life. Here are our top 10 essential tips for planning your perfect wedding in 2024.</p>
      
      <h3>1. Start Early and Set a Budget</h3>
      <p>The key to successful wedding planning is starting early and having a clear budget in mind. Begin planning at least 12-18 months in advance to secure your preferred vendors and venues.</p>
      
      <h3>2. Create a Wedding Planning Timeline</h3>
      <p>Develop a detailed timeline that breaks down all the major tasks and deadlines. This will help you stay organized and ensure nothing falls through the cracks.</p>
      
      <h3>3. Prioritize What Matters Most</h3>
      <p>Identify the three most important aspects of your wedding day and allocate your budget accordingly. This could be the venue, photography, or catering.</p>
      
      <h3>4. Hire a Wedding Planner (If Budget Allows)</h3>
      <p>A professional wedding planner can save you time, stress, and even money by helping you avoid common pitfalls and negotiating with vendors.</p>
      
      <h3>5. Book Your Venue Early</h3>
      <p>Popular venues book up quickly, especially during peak wedding season. Start touring venues as soon as you have your date in mind.</p>
      
      <h3>6. Create a Guest List</h3>
      <p>Your guest count will affect every other aspect of your wedding planning, from venue size to catering costs. Create your guest list early and stick to it.</p>
      
      <h3>7. Research and Book Key Vendors</h3>
      <p>Photographers, videographers, florists, and caterers often book up months in advance. Start researching and booking these vendors early.</p>
      
      <h3>8. Plan for the Weather</h3>
      <p>If you're planning an outdoor wedding, always have a backup plan for inclement weather. Consider tent rentals or indoor alternatives.</p>
      
      <h3>9. Take Care of Legal Requirements</h3>
      <p>Don't forget about the legal aspects of getting married, including obtaining a marriage license and ensuring all paperwork is in order.</p>
      
      <h3>10. Enjoy the Process</h3>
      <p>Remember that wedding planning should be fun! Take time to enjoy the process and celebrate each milestone along the way.</p>
    `,
    author: "WeddingLK Team",
    date: "2024-01-15",
    category: "Planning",
    image: "/placeholder.jpg",
    readTime: "8 min read"
  },
  "2": {
    id: 2,
    title: "Best Wedding Venues in Sri Lanka",
    content: `
      <p>Sri Lanka offers a stunning array of wedding venues, from beachfront resorts to historic colonial buildings. Here are some of the most beautiful venues across the island.</p>
      
      <h3>Beachfront Venues</h3>
      <p>For couples dreaming of a beach wedding, Sri Lanka's coastline offers breathtaking options. From the golden sands of Bentota to the pristine beaches of Galle, you'll find the perfect backdrop for your special day.</p>
      
      <h3>Hill Country Estates</h3>
      <p>The cool climate and stunning mountain views of the hill country provide a romantic setting for intimate weddings. Nuwara Eliya and Kandy offer some of the most picturesque venues.</p>
      
      <h3>Colonial Heritage Venues</h3>
      <p>Sri Lanka's colonial heritage provides unique venues with historic charm. These venues often feature beautiful architecture and well-manicured gardens.</p>
      
      <h3>Luxury Hotels</h3>
      <p>For couples seeking luxury and convenience, Sri Lanka's five-star hotels offer world-class facilities and impeccable service for your wedding day.</p>
    `,
    author: "WeddingLK Team",
    date: "2024-01-10",
    category: "Venues",
    image: "/placeholder.jpg",
    readTime: "6 min read"
  },
  "3": {
    id: 3,
    title: "Budget-Friendly Wedding Ideas",
    content: `
      <p>Planning a beautiful wedding doesn't have to break the bank. Here are creative ideas to help you plan your dream wedding on a budget.</p>
      
      <h3>DIY Decorations</h3>
      <p>Create your own centerpieces, signage, and decorations. This personal touch will make your wedding unique while saving money.</p>
      
      <h3>Choose an Off-Peak Season</h3>
      <p>Consider having your wedding during the off-peak season when venues and vendors often offer discounted rates.</p>
      
      <h3>Opt for Buffet-Style Catering</h3>
      <p>Buffet-style meals are often more cost-effective than plated dinners and allow guests to choose their portions.</p>
      
      <h3>Use Local Flowers</h3>
      <p>Local, seasonal flowers are more affordable than imported varieties and support local businesses.</p>
      
      <h3>Limit the Guest List</h3>
      <p>A smaller, more intimate wedding allows you to focus your budget on the details that matter most to you.</p>
    `,
    author: "WeddingLK Team",
    date: "2024-01-05",
    category: "Budget",
    image: "/placeholder.jpg",
    readTime: "5 min read"
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const postId = params.id as string
  const post = blogPosts[postId as keyof typeof blogPosts]

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-gray-500">{post.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Articles
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(blogPosts)
              .filter(([id]) => id !== postId)
              .slice(0, 2)
              .map(([id, relatedPost]) => (
                <Link key={id} href={`/blog/${id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-2">
                        {relatedPost.category}
                      </Badge>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {relatedPost.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(relatedPost.date).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}