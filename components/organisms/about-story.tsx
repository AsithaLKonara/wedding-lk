"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, Star, Users, Sparkles } from "lucide-react"

export function AboutStory() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              How It All Began
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Wedding Dreams Lanka was born from a simple belief: every couple deserves to have their perfect wedding day. We&apos;re passionate about making your wedding dreams come true.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our journey began in 2020 when we realized that Sri Lanka&apos;s beautiful wedding industry needed a modern, digital platform to connect couples with the best vendors and venues.
            </p>
          </motion.div>

          {/* Story Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Our founding story"
                  width={600}
                  height={500}
                  className="relative rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">2020</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Founded</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 rounded-full px-4 py-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span className="text-pink-700 dark:text-pink-300 font-medium">The Beginning</span>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                A Dream to Transform Sri Lankan Weddings
              </h3>

              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  It all started when our founders, Arjun and Kavitha, experienced the challenges of planning their own
                  wedding in Colombo. Despite Sri Lanka's rich wedding traditions and stunning venues, finding the right
                  vendors and coordinating everything felt overwhelming.
                </p>
                <p>
                  They realized that couples across the island faced similar struggles - from finding authentic Kandyan
                  dancers in Kandy to booking the perfect beach venue in Galle. There had to be a better way.
                </p>
                <p>
                  With backgrounds in technology and event management, they decided to create a platform that would
                  celebrate Sri Lankan wedding culture while making planning effortless and enjoyable.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4">
                  <Star className="w-8 h-8 text-yellow-500 mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">Our Mission</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Making dream weddings accessible to every Sri Lankan couple
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                  <Users className="w-8 h-8 text-blue-500 mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">Our Vision</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    To be the heart of every celebration across the island
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Journey</h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600 rounded-full" />

              {/* Timeline items */}
              <div className="space-y-12">
                {[
                  {
                    year: "2020",
                    title: "The Beginning",
                    description: "Founded with 50 venues and 100 vendors across Colombo and Kandy",
                    side: "left",
                  },
                  {
                    year: "2021",
                    title: "Island-wide Expansion",
                    description: "Expanded to all 9 provinces, adding traditional wedding specialists",
                    side: "right",
                  },
                  {
                    year: "2022",
                    title: "Cultural Integration",
                    description: "Launched Sinhala and Tamil interfaces, traditional ceremony tools",
                    side: "left",
                  },
                  {
                    year: "2023",
                    title: "AI-Powered Matching",
                    description: "Introduced smart vendor matching and personalized recommendations",
                    side: "right",
                  },
                  {
                    year: "2024",
                    title: "Community Platform",
                    description: "Launched social features and real-time wedding planning tools",
                    side: "left",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: item.side === "left" ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center ${item.side === "left" ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`w-5/12 ${item.side === "left" ? "text-right pr-8" : "text-left pl-8"}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-pink-600 mb-2">{item.year}</div>
                        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</div>
                        <div className="text-gray-600 dark:text-gray-300">{item.description}</div>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-4 border-pink-500 rounded-full" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


export default AboutStory
