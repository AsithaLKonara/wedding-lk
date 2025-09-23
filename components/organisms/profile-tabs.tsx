"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfo } from "./personal-info"
import { WeddingDetails } from "./wedding-details"
import { NotificationSettings } from "./notification-settings"
import { AccountSettings } from "./account-settings"

export function ProfileTabs() {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="wedding">Wedding Details</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="mt-6">
        <PersonalInfo />
      </TabsContent>
      
      <TabsContent value="wedding" className="mt-6">
        <WeddingDetails />
      </TabsContent>
      
      <TabsContent value="notifications" className="mt-6">
        <NotificationSettings />
      </TabsContent>
      
      <TabsContent value="account" className="mt-6">
        <AccountSettings />
      </TabsContent>
    </Tabs>
  )
}
