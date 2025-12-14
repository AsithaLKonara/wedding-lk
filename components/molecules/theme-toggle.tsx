"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div suppressHydrationWarning>
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          disabled
        >
          <div className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative"
    >
        <motion.div 
          initial={false} 
          animate={{ rotate: theme === "dark" ? 180 : 0 }} 
          transition={{ duration: 0.3 }}
          key={theme} // Add key to ensure proper re-rendering
        >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
    </div>
  )
}

export default ThemeToggle
