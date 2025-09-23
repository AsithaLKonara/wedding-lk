"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Bell, Settings } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="bg-white dark:bg-gray-800 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, Sarah!</h1>
            <p className="text-gray-600 dark:text-gray-300">Your wedding is in 156 days</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Wedding Date: June 15, 2024
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
