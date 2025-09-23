"use client"

import { motion } from "framer-motion"
import { TestimonialCard } from "@/components/molecules/testimonial-card"

const testimonials = [
  {
    name: "Sarah & Michael",
    role: "Married June 2024",
    content:
      "Wedding.lk made our dream wedding a reality. The platform was so easy to use and helped us stay organized throughout the entire planning process.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Priya & Raj",
    role: "Married August 2024",
    content:
      "The vendor network was incredible. We found our photographer, caterer, and decorator all through the platform. Highly recommended!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Emma & David",
    role: "Married September 2024",
    content:
      "From venue booking to guest management, everything was seamless. Our wedding day was perfect thanks to Wedding.lk!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
]

interface TestimonialsSectionProps {
  [key: string]: any;
}

export default function TestimonialsSection(props: TestimonialsSectionProps) {
  return (
    <section className="py-20 sm:py-32 bg-white/50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Happy Couples</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            See what our couples have to say about their experience
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
