"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/molecules/theme-toggle"
import { NavigationMenu } from "@/components/molecules/navigation-menu"
import { MobileMenu } from "@/components/molecules/mobile-menu"
import { Logo } from "@/components/atoms/logo"
import { Menu, X, Bell } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden lg:block">
            <NavigationMenu />
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="p-3 border-b">
                  <p className="text-sm font-medium">Notifications</p>
                </div>
                <div className="max-h-80 overflow-auto">
                  <div className="p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">New message from a vendor</div>
                  <div className="p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">Your booking request was approved</div>
                  <div className="p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">Discount on photography packages</div>
                </div>
                <div className="p-3 border-t text-center">
                  <Button variant="ghost" size="sm" className="w-full">View all</Button>
                </div>
              </PopoverContent>
            </Popover>

            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </motion.header>
  )
}
