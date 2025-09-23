"use client"

import dynamic from "next/dynamic"

import { useState } from "react"
import { MainLayout } from "@/components/templates/main-layout"

import { motion } from "framer-motion"

const FeedStories = dynamic(() => import("@/components/organisms/feed-stories"), { ssr: false })

const FeedPosts = dynamic(() => import("@/components/organisms/feed-posts"), { ssr: false })

const FeedSidebar = dynamic(() => import("@/components/organisms/feed-sidebar"), { ssr: false })

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Wedding Feed</h1>
            <p className="text-gray-600 dark:text-gray-300">Discover the latest from venues, vendors, and couples</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <FeedStories />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <FeedPosts activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="sticky top-24"
              >
                <FeedSidebar />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
