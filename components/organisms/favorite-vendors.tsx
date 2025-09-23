"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, MapPin, Eye, Trash2 } from "lucide-react"

export function FavoriteVendors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Saved Vendors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No saved vendors yet</p>
          <p className="text-sm">Start exploring and save your favorite vendors</p>
          <Button variant="outline" className="mt-4">
            Browse Vendors
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 