"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const navItems = [
  { href: "/venues", label: "Venues" },
  { href: "/vendors", label: "Vendors" },
  { href: "/feed", label: "Feed" },
  { href: "/gallery", label: "Gallery" },
  { href: "/ai-search", label: "AI Search" },
  { href: "/chat", label: "Chat" },
  { href: "/about", label: "About" },
]

export function NavigationMenu() {
  return (
    <nav className="flex justify-center space-x-8 px-4 sm:px-6 lg:px-8">
      {navItems.map((item) => (
        <motion.div key={item.href} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <Link
            href={item.href}
            className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors"
          >
            {item.label}
          </Link>
        </motion.div>
      ))}
    </nav>
  )
}
