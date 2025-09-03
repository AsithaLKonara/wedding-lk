"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  avatar: string
  rating: number
  className?: string
}

export function TestimonialCard({ name, role, content, avatar, rating, className = "" }: TestimonialCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className={className}>
      <Card className="h-full border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6 italic">&ldquo;{content}&rdquo;</p>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default TestimonialCard 