/**
 * Format currency in LKR (Sri Lankan Rupees)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return "0%"
  return Math.round((value / total) * 100) + "%"
}

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Format date and time
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Calculate days until date
 */
export const daysUntil = (date: Date | string): number => {
  const target = new Date(date)
  const today = new Date()
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(target)
}

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case "admin":
      return "Administrator"
    case "vendor":
      return "Vendor"
    case "wedding_planner":
      return "Wedding Planner"
    case "user":
      return "User"
    default:
      return "User"
  }
}

/**
 * Get role color theme
 */
export const getRoleTheme = (role: string) => {
  switch (role) {
    case "admin":
      return {
        primary: "red",
        primaryHex: "#dc2626",
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
      }
    case "vendor":
      return {
        primary: "blue",
        primaryHex: "#2563eb",
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
      }
    case "wedding_planner":
      return {
        primary: "green",
        primaryHex: "#16a34a",
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
      }
    case "user":
      return {
        primary: "purple",
        primaryHex: "#9333ea",
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
      }
    default:
      return {
        primary: "gray",
        primaryHex: "#6b7280",
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
      }
  }
}