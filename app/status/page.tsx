"use client"

import { ExternalLink, Github, MessageCircle } from "lucide-react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PlatformStatus = dynamic(() => import("@/components/organisms/platform-status"), { ssr: false })

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Platform Status</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time status of all Wedding.lk systems and services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PlatformStatus />
        </div>

        <div className="space-y-6">
          {/* Support Card */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Github className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentation
              </Button>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="border-l-2 border-green-500 pl-3">
                  <p className="font-medium">All systems operational</p>
                  <p className="text-gray-600">2 minutes ago</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="font-medium">Payment system updated</p>
                  <p className="text-gray-600">1 hour ago</p>
                </div>
                <div className="border-l-2 border-purple-500 pl-3">
                  <p className="font-medium">New AI search features deployed</p>
                  <p className="text-gray-600">3 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
