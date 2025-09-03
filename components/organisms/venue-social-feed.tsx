"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Heart, MessageCircle, Share2, Loader2, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface VenueSocialFeedProps {
  venueId: string
}

interface Post {
  id: string
  content: string
  images?: string[]
  tags?: string[]
  author: {
    type: 'user' | 'vendor' | 'venue'
    id: string
    name: string
    avatar?: string
    verified?: boolean
  }
  location?: {
    name: string
    address?: string
    city?: string
    state?: string
    country?: string
  }
  engagement: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  createdAt: string
  formattedDate: string
  userInteractions?: {
    isLiked?: boolean
    isBookmarked?: boolean
  }
}

export default function VenueSocialFeed({ venueId }: VenueSocialFeedProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?limit=5&filter=recent')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Generate default avatar for users
  const getDefaultAvatar = (name: string): string => {
    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=200`
  }

  const handleLike = async (postId: string) => {
    setIsLoading(postId)
    try {
      const response = await fetch(`/api/posts/${postId}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'like',
          userId: 'current-user-id', // TODO: Get from auth context
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  engagement: data.data.engagement,
                  userInteractions: data.data.userInteractions
                }
              : post
          )
        )
        
        toast({ 
          title: "Like updated!", 
          variant: "default" 
        })
      }
    } catch (error) {
      toast({ 
        title: "Failed to update like", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleBookmark = async (postId: string) => {
    setIsLoading(postId)
    try {
      const response = await fetch(`/api/posts/${postId}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bookmark',
          userId: 'current-user-id', // TODO: Get from auth context
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  userInteractions: data.data.userInteractions
                }
              : post
          )
        )
        
        toast({ 
          title: "Bookmark updated!", 
          variant: "default" 
        })
      }
    } catch (error) {
      toast({ 
        title: "Failed to update bookmark", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleShare = async (postId: string) => {
    setIsLoading(postId)
    try {
      const response = await fetch(`/api/posts/${postId}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'share',
          userId: 'current-user-id', // TODO: Get from auth context
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  engagement: data.data.engagement
                }
              : post
          )
        )
        
        toast({ 
          title: "Post shared!", 
          variant: "default" 
        })
      }
    } catch (error) {
      toast({ 
        title: "Failed to share post", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        <span className="ml-2 text-gray-600">Loading social feed...</span>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Posts Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Be the first to share your wedding experience!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Venue Social Feed
        </h3>
        <Button variant="outline" onClick={() => router.push('/feed')}>
          View All Posts
        </Button>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {post.author.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      post.author.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {post.author.name}
                      </h4>
                      {post.author.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{post.formattedDate}</span>
                      {post.location && (
                        <>
                          <MapPin className="h-3 w-3" />
                          <span>{post.location.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {post.content}
              </p>

              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={image}
                        alt={`Post image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    disabled={isLoading === post.id}
                    className={`flex items-center space-x-2 ${post.userInteractions?.isLiked ? 'text-rose-500' : 'text-gray-500'}`}
                  >
                    <Heart className={`h-4 w-4 ${post.userInteractions?.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.engagement.likes}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-gray-500"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.engagement.comments}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(post.id)}
                    disabled={isLoading === post.id}
                    className="flex items-center space-x-2 text-gray-500"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>{post.engagement.shares}</span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(post.id)}
                  disabled={isLoading === post.id}
                  className={`${post.userInteractions?.isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}
                >
                  <Bookmark className={`h-4 w-4 ${post.userInteractions?.isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 