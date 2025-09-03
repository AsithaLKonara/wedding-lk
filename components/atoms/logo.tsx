"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"

interface LogoProps {
  variant?: "light" | "dark"
  className?: string
}

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-gray-900 dark:text-white"

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }} className="relative">
        <Heart className="h-8 w-8 text-rose-500 fill-current" />
      </motion.div>
      <span className={`text-xl font-bold ${textColor}`}>Wedding.lk</span>
    </Link>
  )
}


export default Logo
