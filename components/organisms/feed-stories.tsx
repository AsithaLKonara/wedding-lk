"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"

export function FeedStories() {
  const stories = [
    {
      id: 1,
      name: "Your Story",
      avatar: "/placeholder.svg?height=60&width=60",
      isOwn: true,
      hasStory: false,
    },
    {
      id: 2,
      name: "Grand Ballroom",
      avatar: "/placeholder.svg?height=60&width=60",
      hasStory: true,
      isLive: true,
    },
    {
      id: 3,
      name: "Perfect Moments",
      avatar: "/placeholder.svg?height=60&width=60",
      hasStory: true,
    },
    {
      id: 4,
      name: "Garden Paradise",
      avatar: "/placeholder.svg?height=60&width=60",
      hasStory: true,
    },
    {
      id: 5,
      name: "Seaside Villa",
      avatar: "/placeholder.svg?height=60&width=60",
      hasStory: true,
    },
    {
      id: 6,
      name: "Harmony Band",
      avatar: "/placeholder.svg?height=60&width=60",
      hasStory: true,
    },
  ]

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-2 min-w-[70px] cursor-pointer">
              <div className="relative">
                <Avatar
                  className={`h-16 w-16 ${
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
              </div>
              <span className="text-xs text-center text-gray-700 dark:text-gray-300 truncate w-full">{story.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
