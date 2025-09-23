"use client"

import { motion } from "framer-motion"
import { Heart, Target, Users, Lightbulb } from "lucide-react"

export default function AboutStory() {
  return (
    <div className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Founded in 2020, Wedding.lk was born from a simple belief: every couple deserves 
              to have their dream wedding without the stress and hassle of planning it alone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                The Beginning
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                After helping plan dozens of weddings for friends and family, our founders realized 
                that finding reliable vendors and venues was one of the biggest challenges couples faced. 
                The process was time-consuming, stressful, and often resulted in subpar experiences.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We set out to create a platform that would make wedding planning simple, transparent, 
                and enjoyable. Today, we're proud to be Sri Lanka's leading wedding planning platform.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-rose-100 to-purple-100 dark:from-rose-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-24 h-24 text-rose-500 dark:text-rose-400" />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-4">
                <Target className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h4>
              <p className="text-gray-600 dark:text-gray-300">
                To make wedding planning effortless and enjoyable by connecting couples with 
                the best vendors and providing comprehensive planning tools.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Vision</h4>
              <p className="text-gray-600 dark:text-gray-300">
                To be the go-to platform for all wedding-related services in Sri Lanka, 
                known for quality, reliability, and exceptional customer service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4">
                <Lightbulb className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Values</h4>
              <p className="text-gray-600 dark:text-gray-300">
                We believe in transparency, quality, and putting our customers first. 
                Every decision we make is guided by these core principles.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}