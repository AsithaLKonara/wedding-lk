"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  count: string
  className?: string
}

export function ServiceCard({ icon: Icon, title, description, color, count, className = "" }: ServiceCardProps) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }} className={className}>
      <Card className="h-full border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mb-4`}>
            <Icon className="h-8 w-8 text-white" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{count}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


export default ServiceCard
