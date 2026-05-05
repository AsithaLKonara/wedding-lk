"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { LogOut, User, LayoutDashboard } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/venues", label: "Venues" },
  { href: "/vendors", label: "Vendors" },
  { href: "/feed", label: "Feed" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error in mobile menu:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t bg-white/95 backdrop-blur-md dark:bg-gray-900/95 relative z-[60] overflow-hidden"
          data-testid="mobile-menu"
        >
          <div className="container mx-auto px-4 py-5 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-2" data-testid="mobile-menu-nav">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`font-medium transition-all duration-200 py-2.5 px-3 rounded-lg block text-sm ${
                      isActive
                        ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 font-semibold shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-rose-500 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-rose-400"
                    }`}
                    data-testid={`mobile-menu-link-${item.href.replace("/", "")}`}
                  >
                    {item.label}
                  </Link>
                )
              })}

              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                {authLoading ? (
                  <div className="flex flex-col space-y-2 animate-pulse">
                    <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
                    <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
                  </div>
                ) : user ? (
                  <div className="flex flex-col space-y-4">
                    {/* Logged in User Profile Info Summary */}
                    <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user?.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-purple-100 dark:border-purple-900"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 capitalize mt-1 border border-purple-100/50 dark:border-purple-900/50">
                          {user.role.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button asChild onClick={onClose} className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2">
                        <Link href="/dashboard">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Go to Dashboard</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" asChild onClick={onClose} className="w-full border-gray-200 dark:border-gray-800">
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                    >
                      <Link href="/auth/signup">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu

