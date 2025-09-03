"use client"

import { motion } from "framer-motion"
import { Heart, Users, MapPin, Star, Calendar, Award, Sparkles, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "10,000+",
    label: "Happy Couples",
    description: "Couples who found their perfect wedding through our platform",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: MapPin,
    number: "500+",
    label: "Venues",
    description: "Stunning venues across all 9 provinces of Sri Lanka",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Heart,
    number: "2,000+",
    label: "Vendors",
    description: "Trusted vendors from photographers to traditional dancers",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Calendar,
    number: "15,000+",
    label: "Events Planned",
    description: "Successful weddings and celebrations organized",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "Average Rating",
    description: "Customer satisfaction rating from our couples",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Award,
    number: "50+",
    label: "Awards Won",
    description: "Recognition for excellence in wedding services",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Sparkles,
    number: "25",
    label: "Districts Covered",
    description: "Complete coverage across Sri Lanka",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    number: "95%",
    label: "Success Rate",
    description: "Couples who successfully planned their dream wedding",
    color: "from-teal-500 to-green-500",
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-200/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full px-6 py-3 mb-6 border border-pink-200/50 dark:border-pink-800/50">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Our Impact</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Numbers That Tell Our Story
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From our humble beginnings to becoming Sri Lanka's most trusted wedding platform, these numbers reflect our
            commitment to excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                  />

                  {/* Icon */}
                  <div className="relative mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Number */}
                  <div
                    className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{stat.label}</div>

                  {/* Description */}
                  <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{stat.description}</div>

                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-pink-200/50 dark:border-pink-800/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Be Part of Our Success Story?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Let&apos;s make your wedding dreams come true.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Planning Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Explore Venues
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


export default StatsSection
