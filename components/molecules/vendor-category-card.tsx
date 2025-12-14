"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface VendorCategoryCardProps {
  title: string
  count: string
  image: string
  description: string
  className?: string
}

export function VendorCategoryCard({ title, count, image, description, className = "" }: VendorCategoryCardProps) {
  const router = useRouter()

  const handleClick = () => {
    const categorySlug = title.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")
    router.push(`/vendors?category=${categorySlug}`)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <Card className="h-full border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="relative h-48">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-sm font-medium">{count}</div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


export default VendorCategoryCard
