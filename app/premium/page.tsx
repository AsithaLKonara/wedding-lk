"use client"

import dynamic from "next/dynamic"

import { MainLayout } from "@/components/templates/main-layout"

const PremiumCoupleFeatures = dynamic(() => import("@/components/organisms/premium-couple-features"), { ssr: false })

const CulturalWeddingTools = dynamic(() => import("@/components/organisms/cultural-wedding-tools"), { ssr: false })

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
