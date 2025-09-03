"use client"
import { Button } from "@/components/ui/button"
import VenueSocialFeed from "@/components/organisms/venue-social-feed"
import { Filter, TrendingUp, Clock, Heart } from "lucide-react"

interface FeedPostsProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function FeedPosts({ activeFilter, onFilterChange }: FeedPostsProps) {
  const filters = [
    { id: "all", label: "All Posts", icon: Filter },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "recent", label: "Recent", icon: Clock },
    { id: "liked", label: "Most Liked", icon: Heart },
  ]

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const IconComponent = filter.icon
          return (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => onFilterChange(filter.id)}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <IconComponent className="h-4 w-4" />
              <span>{filter.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Posts Feed */}
      <VenueSocialFeed venueId="all" />
    </div>
  )
}


export default FeedPosts
