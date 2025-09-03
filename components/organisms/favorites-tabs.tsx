"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SavedVenues } from "./saved-venues"

export function FavoritesTabs() {
  return (
    <Tabs defaultValue="venues" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="venues">Saved Venues</TabsTrigger>
        <TabsTrigger value="vendors">Saved Vendors</TabsTrigger>
      </TabsList>
      <TabsContent value="venues">
        <SavedVenues />
      </TabsContent>
      <TabsContent value="vendors">
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg font-medium">No saved vendors yet</p>
          <p className="text-sm">Start exploring and save your favorite vendors</p>
        </div>
      </TabsContent>
    </Tabs>
  )
} 

export default FavoritesTabs
