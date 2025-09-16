"use client"

import { Suspense } from 'react'
import { AdvancedSearch } from '@/components/organisms/advanced-search'

function SearchPageContent() {
  return <AdvancedSearch />
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}