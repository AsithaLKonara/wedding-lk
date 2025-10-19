"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Bell, Settings } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  weddingDate?: string
  avatar?: string
}

interface DashboardStats {
  daysUntilWedding: number
  completedTasks: number
  totalTasks: number
  notifications: number
}

export function DashboardHeader() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Sarah',
    email: 'sarah@example.com'
  })
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    daysUntilWedding: 156,
    completedTasks: 8,
    totalTasks: 15,
    notifications: 3
  })
  const [loading, setLoading] = useState(true)

  // Fetch user profile and dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch user profile
        const userResponse = await fetch('/api/users/profile')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.success) {
            setUserProfile({
              name: userData.data.name || 'User',
              email: userData.data.email || 'user@example.com',
              weddingDate: userData.data.weddingDate,
              avatar: userData.data.avatar
            })
          }
        }

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setDashboardStats({
              daysUntilWedding: statsData.data.daysUntilWedding || 156,
              completedTasks: statsData.data.completedTasks || 8,
              totalTasks: statsData.data.totalTasks || 15,
              notifications: statsData.data.notifications || 3
            })
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatWeddingDate = (dateString?: string) => {
    if (!dateString) return 'June 15, 2024'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'June 15, 2024'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userProfile.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your wedding is in {dashboardStats.daysUntilWedding} days
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Wedding Date: {formatWeddingDate(userProfile.weddingDate)}
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {dashboardStats.notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {dashboardStats.notifications}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            <Avatar>
              <AvatarImage src={userProfile.avatar || "/placeholder.svg?height=40&width=40"} alt={userProfile.name} />
              <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
