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
      <Card className="h-full border border-border/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-xs font-bold uppercase tracking-wider bg-rose-500 px-3 py-1 rounded-full shadow-lg">{count}</div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 group-hover:text-rose-500 transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
            </div>
            <div className="ml-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


export default VendorCategoryCard
