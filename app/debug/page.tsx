"use client"

import { MainLayout } from "@/components/templates/main-layout"
import dynamic from "next/dynamic"

const NavigationDebug = dynamic(() => import("@/components/organisms/navigation-debug"), { ssr: false })

export default function DebugPage() {
  return (
    <MainLayout>
      <NavigationDebug />
    </MainLayout>
  )
}
