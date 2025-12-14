"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Edit } from "lucide-react"

interface ProfileHeaderProps {
  user?: {
    name?: string
    email?: string
    role?: string
    avatar?: string
  }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 p-0">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold">{user?.name || "User Name"}</h1>
              <Badge variant="secondary">{user?.role || "User"}</Badge>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{user?.email || "user@example.com"}</p>
            <p className="text-sm text-gray-500">Member since 2024</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


export default ProfileHeader
