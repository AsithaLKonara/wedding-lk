"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, MessageCircle, Flag, Loader2, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReviewUser {
  name: string
  avatar: string
  weddingDate: string
  verified?: boolean
}

interface Review {
  id: string
  user: ReviewUser
  rating: number
  title: string
  content: string
  date: string
  helpful: number
  images?: string[]
  verified?: boolean
  response?: {
    venueName: string
    content: string
    date: string
  }
}

interface VenueReviewsProps {
  venueId: string
}

export function VenueReviews({ venueId }: VenueReviewsProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set())

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        weddingDate: "June 2024",
        verified: true,
      },
      rating: 5,
      title: "Perfect venue for our dream wedding!",
      content:
        "The Grand Ballroom exceeded all our expectations. The staff was incredibly helpful, the food was amazing, and the venue looked absolutely stunning. Our guests are still talking about how beautiful everything was!",
      date: "2 weeks ago",
      helpful: 12,
      images: ["/placeholder.svg?height=100&width=150"],
      verified: true,
      response: {
        venueName: "Grand Ballroom Hotel",
        content: "Thank you Sarah for your wonderful review! We're so glad we could make your special day perfect. Congratulations!",
        date: "1 week ago"
      }
    },
    {
      id: "2",
      user: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        weddingDate: "August 2024",
        verified: true,
      },
      rating: 5,
      title: "Exceptional service and beautiful venue",
      content:
        "From the initial planning to the wedding day, everything was perfect. The coordination team was professional and attentive to every detail. Highly recommended!",
      date: "1 month ago",
      helpful: 8,
      verified: true,
    },
    {
      id: "3",
      user: {
        name: "Priya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        weddingDate: "May 2024",
      },
      rating: 4,
      title: "Great venue with minor issues",
      content:
        "Overall a wonderful experience. The venue is beautiful and the staff is helpful. Only minor issue was with the sound system during the ceremony, but they fixed it quickly.",
      date: "2 months ago",
      helpful: 5,
    },
    {
      id: "4",
      user: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        weddingDate: "September 2024",
        verified: true,
      },
      rating: 3,
      title: "Good venue but expensive",
      content:
        "The venue is beautiful and well-maintained. However, the pricing was quite high for what we received. The staff was friendly but the coordination could have been better.",
      date: "3 months ago",
      helpful: 3,
    },
  ])

  const getAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
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
      toast({
        title: "Already Marked",
        description: "You've already marked this review as helpful.",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setHelpfulReviews(prev => new Set(prev).add(reviewId))
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ))
      
      toast({
        title: "Review Marked as Helpful",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark review as helpful. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReportReview = async (reviewId: string, reviewTitle: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Review Reported",
        description: `"${reviewTitle}" has been reported for review.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "More Reviews Loaded",
        description: "Additional reviews have been loaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "verified" && review.verified) return true
    if (selectedFilter === "with-images" && review.images && review.images.length > 0) return true
    if (selectedFilter === "with-response" && review.response) return true
    return review.rating === parseInt(selectedFilter)
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "helpful":
        return b.helpful - a.helpful
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const ratingDistribution = getRatingDistribution()

  return (
    <Card role="region" aria-label="Venue Reviews">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" aria-hidden="true" />
            Guest Reviews
            <Badge variant="secondary">
              {reviews.length} reviews
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {getAverageRating()}
              </div>
              <div className="flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(parseFloat(getAverageRating())) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-4">{rating}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">
                {ratingDistribution[rating as keyof typeof ratingDistribution]}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="text-sm border rounded-md px-2 py-1 bg-background"
            aria-label="Filter reviews"
          >
            <option value="all">All Reviews</option>
            <option value="verified">Verified Reviews</option>
            <option value="with-images">With Images</option>
            <option value="with-response">With Response</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border rounded-md px-2 py-1 bg-background"
            aria-label="Sort reviews"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-sm">Be the first to review this venue</p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                  <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{review.user.name}</h4>
                      {review.user.verified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                      {review.verified && (
                        <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Verified Booking
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Wedding: {review.user.weddingDate}
                  </p>

                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                  </div>

                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">{review.title}</h5>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{review.content}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {review.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          />
                          <ImageIcon className="absolute top-1 right-1 h-3 w-3 text-white bg-black/50 rounded" />
                        </div>
                      ))}
                    </div>
                  )}

                  {review.response && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-blue-900 dark:text-blue-200">
                          Response from {review.response.venueName}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-300">
                          {review.response.date}
                        </span>
                      </div>
                      <p className="text-blue-800 dark:text-blue-100 text-sm">
                        {review.response.content}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => handleHelpfulClick(review.id)}
                      disabled={isLoading || helpfulReviews.has(review.id)}
                      aria-label={`Mark "${review.title}" as helpful`}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => handleReportReview(review.id, review.title)}
                      disabled={isLoading}
                      aria-label={`Report review "${review.title}"`}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {sortedReviews.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Load More Reviews"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
