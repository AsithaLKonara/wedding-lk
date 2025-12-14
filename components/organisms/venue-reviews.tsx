"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, MessageCircle, Flag, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VenueReviewsProps {
  reviews: {
    _id: string
    user: {
      firstName: string
      lastName: string
    }
    rating: number
    comment: string
    createdAt: string
  }[]
  rating?: {
    average?: number
    count?: number
  }
  venueId: string
  venueName: string
}

export function VenueReviews({ reviews, rating, venueId, venueName }: VenueReviewsProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set())

  const getAverageRating = () => {
    return rating?.average || 4.5
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const handleHelpfulClick = async (reviewId: string) => {
    if (helpfulReviews.has(reviewId)) {
      setHelpfulReviews(prev => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    } else {
      setHelpfulReviews(prev => new Set(prev).add(reviewId))
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      toast({
        title: "Thank you!",
        description: "Your feedback helps other couples.",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update helpful status.",
        variant: "destructive"
      })
    }
  }

  const handleReportReview = async (reviewId: string, reviewComment: string) => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Review reported",
        description: "Thank you for helping us maintain quality.",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report review.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "More reviews loaded",
        description: "Additional reviews have been loaded.",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more reviews.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "5-star" && review.rating === 5) return true
    if (selectedFilter === "4-star" && review.rating === 4) return true
    if (selectedFilter === "3-star" && review.rating === 3) return true
    if (selectedFilter === "2-star" && review.rating === 2) return true
    if (selectedFilter === "1-star" && review.rating === 1) return true
    return false
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (sortBy === "rating") {
      return b.rating - a.rating
    }
    return 0
  })

  const averageRating = getAverageRating()
  const ratingDistribution = getRatingDistribution()

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>What couples say about {venueName}</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500">{rating?.count || 0} reviews</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Rating Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Rating Distribution</h4>
              {[5, 4, 3, 2, 1].map(stars => (
                <div key={stars} className="flex items-center space-x-2 mb-1">
                  <span className="text-sm w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${(ratingDistribution[stars as keyof typeof ratingDistribution] / (rating?.count || 1)) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">
                    {ratingDistribution[stars as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Filters</h4>
              <div className="space-y-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Reviews</option>
                  <option value="5-star">5 Star</option>
                  <option value="4-star">4 Star</option>
                  <option value="3-star">3 Star</option>
                  <option value="2-star">2 Star</option>
                  <option value="1-star">1 Star</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="recent">Most Recent</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <div key={review._id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt={`${review.user.firstName} ${review.user.lastName}`} />
                  <AvatarFallback>{review.user.firstName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {review.user.firstName} {review.user.lastName}
                      </h4>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{review.comment}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpfulClick(review._id)}
                      disabled={isLoading}
                      aria-label={`Mark review as helpful`}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReportReview(review._id, review.comment)}
                      disabled={isLoading}
                      aria-label={`Report review`}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {sortedReviews.length < reviews.length && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Reviews"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default VenueReviews
