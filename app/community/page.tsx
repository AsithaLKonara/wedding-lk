"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Heart, Share, User } from "lucide-react"

const communityPosts = [
  {
    id: 1,
    title: "Just booked my dream venue! 🎉",
    content: "After months of searching, I finally found the perfect beach venue in Galle. The sunset ceremony will be magical!",
    author: "Sarah J.",
    date: "2 hours ago",
    likes: 24,
    comments: 8,
    category: "Venues"
  },
  {
    id: 2,
    title: "Budget-friendly decoration ideas",
    content: "Sharing some DIY decoration tips that saved us thousands. Sometimes the simplest ideas create the most beautiful results!",
    author: "Mike & Lisa",
    date: "1 day ago",
    likes: 42,
    comments: 15,
    category: "Decorations"
  },
  {
    id: 3,
    title: "Photography vendor recommendations",
    content: "Looking for a photographer in Kandy area. Any recommendations? Budget is around 100k for the full day.",
    author: "Priya M.",
    date: "3 days ago",
    likes: 12,
    comments: 23,
    category: "Vendors"
  }
]

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Wedding Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Connect with other couples, share experiences, and get inspired
          </p>
          <Button size="lg">
            <MessageCircle className="mr-2 h-5 w-5" />
            Start a Discussion
          </Button>
        </div>

        <div className="space-y-6">
          {communityPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {post.content}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                    <Share className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Join the Conversation</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Share your wedding planning journey, ask questions, and help other couples 
                make their special day perfect.
              </p>
              <Button size="lg">
                Become a Member
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}