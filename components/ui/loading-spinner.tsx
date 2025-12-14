"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  )
}

// Skeleton loader for content
export function SkeletonLoader({
  className,
  lines = 3,
  variant = "text",
}: {
  className?: string
  lines?: number
  variant?: "text" | "card" | "avatar"
}) {
  if (variant === "card") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (variant === "avatar") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-12 w-12" />
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-gray-200 dark:bg-gray-700 rounded",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

// Page loading overlay
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </div>
  )
}


export default LoadingSpinner
