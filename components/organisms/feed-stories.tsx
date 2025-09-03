"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Loader2, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Story {
  _id: string
  name: string
  avatar?: string
  hasStory: boolean
  isLive?: boolean
  isOwn?: boolean
  likes?: number
  isLiked?: boolean
}

export function FeedStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Fetch venues and vendors for stories
        const [venuesResponse, vendorsResponse] = await Promise.all([
          fetch('/api/venues/search?limit=5'),
          fetch('/api/vendors/search?limit=3')
        ])

        const storiesData: Story[] = [
          {
            _id: 'own-story',
            name: "Your Story",
            isOwn: true,
            hasStory: false,
          }
        ]

        if (venuesResponse.ok) {
          const venuesData = await venuesResponse.json()
          venuesData.venues?.slice(0, 3).forEach((venue: any, index: number) => {
            storiesData.push({
              _id: venue._id,
              name: venue.name,
              hasStory: true,
              isLive: index === 0, // First venue is live
              likes: Math.floor(Math.random() * 50) + 10,
              isLiked: false
            })
          })
        }

        if (vendorsResponse.ok) {
          const vendorsData = await vendorsResponse.json()
          vendorsData.vendors?.slice(0, 2).forEach((vendor: any) => {
            storiesData.push({
              _id: vendor._id,
              name: vendor.businessName || vendor.name,
              hasStory: true,
              likes: Math.floor(Math.random() * 30) + 5,
              isLiked: false
            })
          })
        }

        setStories(storiesData)
      } catch (error) {
        console.error('Error fetching stories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  const handleStoryClick = (story: Story) => {
    if (story.isOwn) {
      // Handle own story - could open story creation modal
      toast({
        title: "Create Story",
        description: "Story creation feature coming soon!",
      })
    } else {
      // Handle viewing story - could open story viewer modal
      toast({
        title: "View Story",
        description: `Viewing story from ${story.name}`,
      })
    }
  }

  const handleStoryLike = async (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent story click
    
    try {
      // Update local state immediately for better UX
      setStories(prev => 
        prev.map(story => 
          story._id === storyId 
            ? { 
                ...story, 
                isLiked: !story.isLiked,
                likes: (story.likes || 0) + (story.isLiked ? -1 : 1)
              }
            : story
        )
      )

      // Here you would make an API call to update the like in the database
      // await fetch(`/api/stories/${storyId}/like`, { method: 'POST' })
      
      toast({
        title: "Story liked!",
        description: "Your like has been recorded.",
      })
    } catch (error) {
      // Revert the change if API call fails
      setStories(prev => 
        prev.map(story => 
          story._id === storyId 
            ? { 
                ...story, 
                isLiked: !story.isLiked,
                likes: (story.likes || 0) + (story.isLiked ? 1 : -1)
              }
            : story
        )
      )
      
      toast({
        title: "Error",
        description: "Failed to like story. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
            <span className="ml-2 text-gray-600">Loading stories...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="flex space-x-6 overflow-x-auto pb-2">
          {stories.map((story) => (
            <div 
              key={story._id} 
              className="flex flex-col items-center space-y-3 min-w-[80px] cursor-pointer group"
              onClick={() => handleStoryClick(story)}
            >
              <div className="relative">
                <Avatar
                  className={`h-16 w-16 transition-transform group-hover:scale-105 ${
                    story.hasStory
                      ? "ring-2 ring-gradient-to-r from-pink-500 to-purple-500 ring-offset-2"
                      : story.isOwn
                        ? "ring-2 ring-gray-300 ring-offset-2"
                        : ""
                  }`}
                >
                  <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.name} />
                  <AvatarFallback>{story.name[0]}</AvatarFallback>
                </Avatar>
                
                {story.isOwn && !story.hasStory && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                )}
                
                {story.isLive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    LIVE
                  </div>
                )}

                {/* Like button for stories with content */}
                {story.hasStory && !story.isOwn && (
                  <button
                    onClick={(e) => handleStoryLike(story._id, e)}
                    className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      story.isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${story.isLiked ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
              
              <div className="text-center">
                <span className="text-xs text-gray-700 dark:text-gray-300 truncate w-full block">
                  {story.name}
                </span>
                {story.hasStory && story.likes && story.likes > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {story.likes} likes
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


export default FeedStories
