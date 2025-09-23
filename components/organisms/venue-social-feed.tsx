"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark, Heart, MessageCircle, Share2, Loader2, Image as ImageIcon, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface VenueSocialFeedProps {
  venueId: string
}

interface Post {
  id: string
  user: {
    name: string
    avatar: string
    verified?: boolean
  }
  content: string
  images?: string[]
  likes: number
  comments: number
  shares: number
  date: string
  location?: string
  tags?: string[]
  isLiked?: boolean
  isBookmarked?: boolean
}

export default function VenueSocialFeed({ venueId }: VenueSocialFeedProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      user: {
        name: "Sarah & Mike",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      content: "Just had our dream wedding at this amazing venue! The staff was incredible and everything was perfect. Highly recommend! 💕 #WeddingDay #DreamVenue",
      images: ["/placeholder.svg?height=300&width=400"],
      likes: 156,
      comments: 23,
      shares: 8,
      date: "2 days ago",
      location: "Grand Ballroom Hotel",
      tags: ["#WeddingDay", "#DreamVenue", "#PerfectDay"],
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "2",
      user: {
        name: "Priya & David",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      content: "Our wedding photos turned out absolutely stunning! The venue provided the perfect backdrop for our special day. Thank you for making it magical! ✨",
      images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
      likes: 89,
      comments: 12,
      shares: 5,
      date: "1 week ago",
      location: "Grand Ballroom Hotel",
      tags: ["#WeddingPhotos", "#MagicalDay", "#PerfectBackdrop"],
      isLiked: true,
      isBookmarked: true,
    },
    {
      id: "3",
      user: {
        name: "Emma & James",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Just booked our wedding venue! Can't wait to start planning. The team was so helpful during our tour. #WeddingPlanning #Excited",
      likes: 45,
      comments: 8,
      shares: 3,
      date: "2 weeks ago",
      location: "Grand Ballroom Hotel",
      tags: ["#WeddingPlanning", "#Excited", "#NewlyEngaged"],
      isLiked: false,
      isBookmarked: false,
    },
  ])

  const handleLike = async (postId: string) => {
    setIsLoading(postId)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          }
        }
        return post
      }))
      
      const post = posts.find(p => p.id === postId)
      toast({
        title: post?.isLiked ? "Post Unliked" : "Post Liked",
        description: post?.isLiked ? "Removed from your likes" : "Added to your likes",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleComment = async (postId: string) => {
    setIsLoading(postId)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      toast({
        title: "Opening Comments",
        description: "Taking you to the post comments",
      })
      
      router.push(`/posts/${postId}`)
    } catch (error) {
      toast({
        title: "Navigation Error",
        description: "Failed to open comments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleShare = async (postId: string) => {
    setIsLoading(postId)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (navigator.share) {
        await navigator.share({
          title: "Beautiful Wedding Venue",
          text: "Check out this amazing wedding venue!",
          url: `${window.location.origin}/posts/${postId}`,
        })
        
        setPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, shares: post.shares + 1 } : post
        ))
        
        toast({
          title: "Post Shared",
          description: "Successfully shared the post",
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`)
        toast({
          title: "Link Copied",
          description: "Post link copied to clipboard",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleBookmark = async (postId: string) => {
    setIsLoading(postId)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked
          }
        }
        return post
      }))
      
      const post = posts.find(p => p.id === postId)
      toast({
        title: post?.isBookmarked ? "Post Unbookmarked" : "Post Bookmarked",
        description: post?.isBookmarked ? "Removed from your bookmarks" : "Added to your bookmarks",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <Card role="region" aria-label="Venue Social Feed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Social Feed
          <Badge variant="secondary">
            {posts.length} posts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No social posts yet</p>
            <p className="text-sm">Be the first to share your experience</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {post.user.name}
                    </h4>
                    {post.user.verified && (
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {post.date}
                    {post.location && (
                      <>
                        <span>•</span>
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        {post.location}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-900 dark:text-white mb-4 leading-relaxed">
                {post.content}
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {post.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Post image ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      <ImageIcon className="absolute top-2 right-2 h-4 w-4 text-white bg-black/50 rounded" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`p-0 h-auto ${post.isLiked ? 'text-red-500' : 'text-gray-600'}`}
                    onClick={() => handleLike(post.id)}
                    disabled={isLoading !== null}
                    aria-label={`${post.isLiked ? 'Unlike' : 'Like'} post`}
                  >
                    {isLoading === post.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    )}
                    <span className="ml-1">{formatNumber(post.likes)}</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto text-gray-600"
                    onClick={() => handleComment(post.id)}
                    disabled={isLoading !== null}
                    aria-label={`View ${post.comments} comments`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="ml-1">{formatNumber(post.comments)}</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto text-gray-600"
                    onClick={() => handleShare(post.id)}
                    disabled={isLoading !== null}
                    aria-label="Share post"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="ml-1">{formatNumber(post.shares)}</span>
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-0 h-auto ${post.isBookmarked ? 'text-blue-500' : 'text-gray-600'}`}
                  onClick={() => handleBookmark(post.id)}
                  disabled={isLoading !== null}
                  aria-label={`${post.isBookmarked ? 'Remove from' : 'Add to'} bookmarks`}
                >
                  <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          ))
        )}
        
        {posts.length > 0 && (
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full" disabled={isLoading !== null}>
              Load More Posts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 