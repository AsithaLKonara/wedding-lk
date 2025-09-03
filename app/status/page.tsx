"use client"

import dynamic from "next/dynamic"
import { MainLayout } from "@/components/templates/main-layout"

const PlatformStatus = dynamic(() => import("@/components/organisms/platform-status"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function StatusPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Platform Status</h1>
        <PlatformStatus />
      </div>
    </MainLayout>
  )
}
