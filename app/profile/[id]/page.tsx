'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Star, MapPin, Calendar, Mail, Phone, Heart, MessageCircle, Share2, Award, Users } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  stats?: {
    totalBookings: number
    totalReviews: number
    averageRating: number
    memberSince: string
  }
  isFollowing?: boolean
  isBlocked?: boolean
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [userId])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
        setIsFollowing(data.isFollowing || false)
        setIsBlocked(data.isBlocked || false)
      } else {
        // Mock data for testing
        setUserData({
          _id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          role: 'couple',
          avatar: '/images/avatar-placeholder.jpg',
          bio: 'Passionate about creating beautiful wedding experiences. Love helping couples plan their perfect day.',
          location: 'Colombo, Sri Lanka',
          phone: '+94 77 123 4567',
          website: 'https://example.com',
          socialLinks: {
            facebook: 'https://facebook.com/user',
            instagram: 'https://instagram.com/user',
            twitter: 'https://twitter.com/user'
          },
          stats: {
            totalBookings: 15,
            totalReviews: 8,
            averageRating: 4.8,
            memberSince: '2023-01-15'
          }
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ follow: !isFollowing })
      })
      
      if (response.ok) {
        setIsFollowing(!isFollowing)
        toast.success(isFollowing ? 'Unfollowed user' : 'Following user')
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      toast.error('Failed to update follow status')
    }
  }

  const handleBlock = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ block: !isBlocked })
      })
      
      if (response.ok) {
        setIsBlocked(!isBlocked)
        toast.success(isBlocked ? 'Unblocked user' : 'Blocked user')
      }
    } catch (error) {
      console.error('Error toggling block:', error)
      toast.error('Failed to update block status')
    }
  }

  const handleMessage = () => {
    // Redirect to messaging or open chat
    window.location.href = `/messages/${userId}`
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${userData?.name} - WeddingLK Profile`,
          text: `Check out ${userData?.name}'s profile on WeddingLK`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Profile link copied to clipboard')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                    <div className="flex items-center mt-1">
                      <Badge variant="secondary" className="mr-2">
                        {userData.role}
                      </Badge>
                      {userData.stats && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {userData.stats.averageRating} ({userData.stats.totalReviews} reviews)
                        </div>
                      )}
                    </div>
                    {userData.bio && (
                      <p className="text-gray-700 mt-2">{userData.bio}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFollow}
                      className={isFollowing ? 'text-blue-500 border-blue-500' : ''}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMessage}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {userData.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {userData.location}
                    </div>
                  )}
                  {userData.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {userData.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {userData.email}
                  </div>
                  {userData.stats && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Member since {new Date(userData.stats.memberSince).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats */}
            {userData.stats && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{userData.stats.totalBookings}</div>
                      <div className="text-sm text-gray-600">Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{userData.stats.totalReviews}</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{userData.stats.averageRating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {Math.floor((new Date().getTime() - new Date(userData.stats.memberSince).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-gray-600">Days Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {userData.socialLinks && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    {userData.socialLinks.facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={userData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      </Button>
                    )}
                    {userData.socialLinks.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={userData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      </Button>
                    )}
                    {userData.socialLinks.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={userData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      </Button>
                    )}
                    {userData.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={userData.website} target="_blank" rel="noopener noreferrer">
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    onClick={handleFollow}
                    className="w-full"
                    variant={isFollowing ? "outline" : "default"}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                  <Button 
                    onClick={handleMessage}
                    variant="outline" 
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline" 
                    className="w-full"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                  <Button 
                    onClick={handleBlock}
                    variant="destructive" 
                    className="w-full"
                  >
                    {isBlocked ? 'Unblock User' : 'Block User'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Role</span>
                    <p className="text-sm">{userData.role}</p>
                  </div>
                  {userData.location && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location</span>
                      <p className="text-sm">{userData.location}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <p className="text-sm">{userData.email}</p>
                  </div>
                  {userData.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone</span>
                      <p className="text-sm">{userData.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}



interface User {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  stats?: {
    totalBookings: number
    totalReviews: number
    averageRating: number
    memberSince: string
  }
  isFollowing?: boolean
  isBlocked?: boolean
}
