"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/venues", label: "Venues" },
  { href: "/vendors", label: "Vendors" },
  { href: "/feed", label: "Feed" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
]

export function NavigationMenu() {
  const pathname = usePathname()

  return (
    <nav className="flex justify-center space-x-8 px-4 sm:px-6 lg:px-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/")

        return (
          <motion.div 
            key={item.href} 
            whileHover={{ y: -1 }} 
            transition={{ duration: 0.2 }}
            className="relative py-2"
          >
            <Link
              href={item.href}
              className={`font-medium transition-colors text-sm px-1 py-1 block ${
                isActive
                  ? "text-purple-600 dark:text-purple-400 font-semibold"
                  : "text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400"
              }`}
            >
              {item.label}
            </Link>
            {isActive && (
              <motion.div
                layoutId="activeNavUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </motion.div>
        )
      })}
    </nav>
  )
}

export default NavigationMenu

