"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/molecules/theme-toggle"
import { NavigationMenu } from "@/components/molecules/navigation-menu"
import { MobileMenu } from "@/components/molecules/mobile-menu"
import { Logo } from "@/components/atoms/logo"
import { NotificationDropdown } from "@/components/organisms/notification-dropdown"
import { LogoutButton } from "@/components/molecules/logout-button"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, loading: authLoading } = useAuth();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden lg:block">
            <NavigationMenu />
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />

            <NotificationDropdown />

            <div className="hidden md:flex items-center space-x-2">
              {authLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              ) : user ? (
                <LogoutButton user={user} />
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          data-testid="mobile-menu-overlay"
        />
      )}
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </motion.header>
  )
}


export default Header
