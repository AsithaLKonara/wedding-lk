"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Calendar, Star } from "lucide-react"

export function FeedSidebar() {
  const trendingVenues = [
    {
      id: 1,
      name: "Grand Ballroom Hotel",
      followers: "2.5K",
      avatar: "/placeholder.svg?height=40&width=40",
      trending: true,
    },
    {
      id: 2,
      name: "Garden Paradise Resort",
      followers: "1.8K",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Seaside Wedding Villa",
      followers: "3.2K",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Wedding Expo 2024",
      date: "March 15-17",
      location: "BMICH, Colombo",
    },
    {
      id: 2,
      title: "Bridal Fashion Show",
      date: "April 5",
      location: "Hilton Colombo",
    },
  ]

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
          {trendingVenues.map((venue) => (
            <div key={venue.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={venue.avatar || "/placeholder.svg"} alt={venue.name} />
                  <AvatarFallback>{venue.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{venue.name}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {venue.followers} followers
                  </div>
                </div>
              </div>
              {venue.trending && <Badge className="bg-orange-100 text-orange-800 text-xs">Trending</Badge>}
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            View All
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Calendar className="mr-2 h-5 w-5 text-blue-500" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{event.date}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{event.location}</div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            View All Events
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
            <span className="font-medium text-gray-900 dark:text-white">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Venues Saved</span>
            <span className="font-medium text-gray-900 dark:text-white">8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Vendors Following</span>
            <span className="font-medium text-gray-900 dark:text-white">12</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default FeedSidebar
