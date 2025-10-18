"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Wedding Planning Tips for 2024",
    excerpt: "Discover the latest trends and expert advice for planning your perfect wedding day.",
    author: "WeddingLK Team",
    date: "2024-01-15",
    category: "Planning",
    image: "/placeholder.jpg"
  },
  {
    id: 2,
    title: "Best Wedding Venues in Sri Lanka",
    excerpt: "Explore the most beautiful and unique wedding venues across Sri Lanka.",
    author: "WeddingLK Team",
    date: "2024-01-10",
    category: "Venues",
    image: "/placeholder.jpg"
  },
  {
    id: 3,
    title: "Budget-Friendly Wedding Ideas",
    excerpt: "Plan your dream wedding without breaking the bank with these creative ideas.",
    author: "WeddingLK Team",
    date: "2024-01-05",
    category: "Budget",
    image: "/placeholder.jpg"
  }
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Wedding Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Expert advice, tips, and inspiration for your perfect wedding
          </p>
        </div>

        <div className="grid gap-8 md:gap-12">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
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
                      <Link 
                        href={`/blog/${post.id}`}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Read More <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            More blog posts coming soon!
          </p>
          <p className="text-sm text-gray-500">
            Subscribe to our newsletter to stay updated with the latest wedding tips and trends.
          </p>
        </div>
      </div>
    </div>
  )
}