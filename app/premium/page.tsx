"use client"

import dynamic from "next/dynamic"

import { MainLayout } from "@/components/templates/main-layout"

const PremiumCoupleFeatures = dynamic(() => import("@/components/organisms/premium-couple-features"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

const CulturalWeddingTools = dynamic(() => import("@/components/organisms/cultural-wedding-tools"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function PremiumPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <PremiumCoupleFeatures />
        <CulturalWeddingTools />
      </div>
    </MainLayout>
  )
}
