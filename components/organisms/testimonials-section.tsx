"use client"

import { motion } from "framer-motion"

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Couples Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Hear from happy couples who planned their perfect wedding with us
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder testimonials - Avatar component temporarily disabled */}
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }} 
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, star) => (
                  <div key={star} className="h-4 w-4 text-yellow-400">⭐</div>
                ))}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                &ldquo;Wedding Dreams Lanka made our wedding planning so much easier. We found the perfect venue and vendors in just a few days!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 mr-3 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {i === 1 ? 'JD' : i === 2 ? 'SM' : 'AL'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {i === 1 ? 'John & Diana' : i === 2 ? 'Sarah & Mike' : 'Alex & Lisa'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Married {i === 1 ? 'June 2024' : i === 2 ? 'August 2024' : 'September 2024'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
