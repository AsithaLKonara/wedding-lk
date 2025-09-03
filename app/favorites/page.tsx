"use client"

import dynamic from "next/dynamic"

import { MainLayout } from "@/components/templates/main-layout"

import { motion } from "framer-motion"

const FavoritesTabs = dynamic(() => import("@/components/organisms/favorites-tabs"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function FavoritesPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">My Favorites</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">Keep track of your favorite venues and vendors</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FavoritesTabs />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
