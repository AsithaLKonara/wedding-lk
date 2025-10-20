"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { FeedStories } from "@/components/organisms/feed-stories"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Filter, 
  TrendingUp, 
  Clock, 
  MapPin,
  Star
} from "lucide-react"
import { motion } from "framer-motion"

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const filters = [
    { id: "all", label: "All Posts", icon: Filter },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "recent", label: "Recent", icon: Clock },
    { id: "liked", label: "Most Liked", icon: Heart },
  ]

  // Stories are rendered via the reusable FeedStories component

  const feedPosts = [
    {
      id: 1,
      type: "venue",
      author: "Grand Ballroom Hotel",
      avatar: "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=60&h=60&fit=crop",
      content: "Just finished setting up the most beautiful garden ceremony space! 🌸 Perfect for intimate weddings with up to 150 guests. Book now for March 2024!",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop",
      likes: 127,
      comments: 23,
      shares: 8,
      timestamp: "2 hours ago",
      location: "Colombo, Sri Lanka",
      tags: ["garden wedding", "intimate ceremony", "march 2024"]
    },
    {
      id: 2,
      type: "vendor",
      author: "Elegant Photography Studio",
      avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop",
      content: "Behind the scenes of yesterday's beach wedding shoot! 📸 The golden hour lighting was absolutely magical. Can't wait to share the final gallery with the couple!",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      likes: 89,
      comments: 15,
      shares: 12,
      timestamp: "4 hours ago",
      location: "Bentota, Sri Lanka",
      tags: ["beach wedding", "photography", "golden hour"]
    },
    {
      id: 3,
      type: "couple",
      author: "Sarah & John",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face",
      content: "We said YES! 💍 Our wedding day was absolutely perfect thanks to all the amazing vendors who made our dream come true. Forever grateful! ❤️",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=400&fit=crop",
      likes: 234,
      comments: 45,
      shares: 67,
      timestamp: "6 hours ago",
      location: "Kandy, Sri Lanka",
      tags: ["just married", "thank you", "perfect day"]
    }
  ]

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Wedding Feed</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover the latest from venues, vendors, and couples
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {/* Stories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <FeedStories />
              </motion.div>

              {/* Filter Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex space-x-2 overflow-x-auto pb-2"
              >
                {filters.map((filter) => {
                  const IconComponent = filter.icon
                  return (
                    <Button
                      key={filter.id}
                      variant={activeFilter === filter.id ? "default" : "outline"}
                      onClick={() => setActiveFilter(filter.id)}
                      className="flex items-center space-x-2 whitespace-nowrap"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{filter.label}</span>
                    </Button>
                  )
                })}
              </motion.div>

              {/* Posts Feed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                {feedPosts.map((post, index) => (
                  <Card key={post.id} className="bg-white dark:bg-gray-800 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.avatar} alt={post.author} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {post.author}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {post.type}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{post.timestamp}</span>
                            {post.location && (
                              <>
                                <span className="mx-1">•</span>
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{post.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-gray-900 dark:text-white mb-4">
                        {post.content}
                      </p>
                      
                      {post.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={post.image}
                            alt={`Post by ${post.author}`}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center space-x-2 ${
                              likedPosts.includes(post.id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <Heart 
                              className={`h-4 w-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} 
                            />
                            <span>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <Share2 className="h-4 w-4" />
                            <span>{post.shares}</span>
                          </Button>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                          <Star className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="sticky top-24 space-y-6"
              >
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Trending Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["Garden Weddings", "Beach Ceremonies", "Traditional Venues", "Photography Tips"].map((topic, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">#{topic}</span>
                          <Badge variant="secondary" className="text-xs">{Math.floor(Math.random() * 100) + 10}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Venues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["Grand Ballroom Hotel", "Garden Paradise Resort", "Beachfront Villa"].map((venue, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://images.unsplash.com/photo-${1519167758481 + index}?w=32&h=32&fit=crop`} alt={venue} />
                            <AvatarFallback>{venue[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{venue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
