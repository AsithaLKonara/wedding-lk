"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface VendorReviewsProps {
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
  vendorId: string
  vendorName: string
}

export function VendorReviews({ reviews, rating, vendorId, vendorName }: VendorReviewsProps) {
  const averageRating = rating?.average || 4.5

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>What couples say about this vendor</CardDescription>
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
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt={`${review.user.firstName} ${review.user.lastName}`} />
                  <AvatarFallback>{review.user.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{review.user.firstName} {review.user.lastName}</h4>
                    <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
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
                  <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


export default VendorReviews
