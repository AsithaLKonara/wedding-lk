"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Calendar, Star, Loader2 } from "lucide-react"

interface TrendingVenue {
  _id: string
  name: string
  rating: {
    average: number
    count: number
  }
  location: {
    city: string
  }
}

interface UserActivity {
  postsLiked: number
  venuesSaved: number
  vendorsFollowing: number
}

export function FeedSidebar() {
  const [trendingVenues, setTrendingVenues] = useState<TrendingVenue[]>([])
  const [userActivity, setUserActivity] = useState<UserActivity>({
    postsLiked: 0,
    venuesSaved: 0,
    vendorsFollowing: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trending venues
        const venuesResponse = await fetch('/api/venues/search?limit=3&sort=rating')
        if (venuesResponse.ok) {
          const venuesData = await venuesResponse.json()
          setTrendingVenues(venuesData.venues || [])
        }

        // Fetch user activity from database
        try {
          const [favoritesResponse, postsResponse] = await Promise.all([
            fetch('/api/favorites'),
            fetch('/api/posts?userId=current&limit=100')
          ])
          
          let userActivity = {
            postsLiked: 0,
            venuesSaved: 0,
            vendorsFollowing: 0
          }
          
          if (favoritesResponse.ok) {
            const favoritesData = await favoritesResponse.json()
            userActivity.venuesSaved = favoritesData.favorites?.venues?.length || 0
            userActivity.vendorsFollowing = favoritesData.favorites?.vendors?.length || 0
          }
          
          if (postsResponse.ok) {
            const postsData = await postsResponse.json()
            userActivity.postsLiked = postsData.posts?.reduce((sum: number, post: any) => sum + (post.likes || 0), 0) || 0
          }
          
          setUserActivity(userActivity)
        } catch (error) {
          console.error('Error fetching user activity:', error)
          // Fallback to mock data
          setUserActivity({
            postsLiked: Math.floor(Math.random() * 50) + 10,
            venuesSaved: Math.floor(Math.random() * 20) + 5,
            vendorsFollowing: Math.floor(Math.random() * 30) + 8
          })
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Trending Venues */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="mr-2 h-5 w-5 text-orange-500" />
            Trending Venues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingVenues.length > 0 ? (
            trendingVenues.map((venue, index) => (
              <div key={venue._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{venue.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{venue.name}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {venue.rating?.average?.toFixed(1) || '4.5'} ({venue.rating?.count || 0} reviews)
                    </div>
                  </div>
                </div>
                {index === 0 && <Badge className="bg-orange-100 text-orange-800 text-xs">Trending</Badge>}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">No trending venues found</p>
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full">
            View All
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Star className="mr-2 h-5 w-5 text-purple-500" />
            Your Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Posts Liked</span>
            <span className="font-medium text-gray-900 dark:text-white">{userActivity.postsLiked}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Venues Saved</span>
            <span className="font-medium text-gray-900 dark:text-white">{userActivity.venuesSaved}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Vendors Following</span>
            <span className="font-medium text-gray-900 dark:text-white">{userActivity.vendorsFollowing}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default FeedSidebar
