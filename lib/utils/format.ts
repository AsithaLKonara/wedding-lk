/**
 * Format currency in LKR (Sri Lankan Rupees) or USD
 */
export const formatCurrency = (amount: number | null | undefined, currency: string = 'LKR'): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return currency === 'USD' ? '$0.00' : 'LKR 0.00'
  
  if (currency === 'USD') {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }
  
  // For LKR, use manual formatting to ensure consistent output
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  
  return `LKR ${formatted}`
}

/**
 * Safe number formatting with LKR prefix
 */
export const formatLKR = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return "LKR 0"
  return `LKR ${amount.toLocaleString()}`
}

/**
 * Safe toLocaleString wrapper
 */
export const safeToLocaleString = (value: any, fallback: string = "N/A"): string => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'number' && !isNaN(value)) return value.toLocaleString()
  if (value instanceof Date && !isNaN(value.getTime())) return value.toLocaleString()
  return fallback
}

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined || isNaN(num)) return "0"
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
export const formatDate = (date: Date | string | null | undefined, locale: string = 'en-US'): string => {
  if (!date) return "N/A"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "Invalid Date"
  
  if (locale === 'si-LK') {
    return d.toLocaleDateString("si-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  if (locale === 'short') {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }
  
  if (locale === 'long') {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Format date and time
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "Invalid Date"
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
export const daysUntil = (date: Date | string | null | undefined): number => {
  if (!date) return 0
  const target = new Date(date)
  if (isNaN(target.getTime())) return 0
  const today = new Date()
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A"
  const now = new Date()
  const target = new Date(date)
  if (isNaN(target.getTime())) return "Invalid Date"
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

/**
 * Generate unique booking ID with date prefix
 */
export const generateBookingId = (): string => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `BK${today}${random}`
}

/**
 * Calculate total price for booking
 */
export const calculateTotalPrice = (params: {
  basePrice: number
  guestCount: number
  pricePerGuest: number
  additionalServices?: Array<{ price: number; quantity?: number }>
}): number => {
  const { basePrice, guestCount, pricePerGuest, additionalServices = [] } = params
  
  let total = basePrice
  
  // Add per-guest pricing
  if (pricePerGuest > 0 && guestCount > 0) {
    total += pricePerGuest * guestCount
  }
  
  // Add additional services
  additionalServices.forEach(service => {
    const quantity = service.quantity || 1
    total += service.price * quantity
  })
  
  return total
}