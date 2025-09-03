export function formatCurrency(amount: number, currency = "LKR"): string {
  if (currency === "LKR") {
    return `LKR ${amount.toLocaleString("en-US")}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatDate(date: string | Date, format: "short" | "long" | "relative" = "short"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  switch (format) {
    case "short": {
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
    case "long": {
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    }
    case "relative": {
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - dateObj.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return "Today"
      if (diffDays === 1) return "Tomorrow"
      if (diffDays < 7) return `In ${diffDays} days`
      if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`
      return `In ${Math.ceil(diffDays / 30)} months`
    }
    default:
      return dateObj.toLocaleDateString()
  }
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Sri Lankan phone number formatting
  if (cleaned.startsWith("94")) {
    // International format
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  } else if (cleaned.startsWith("0")) {
    // Local format
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }

  return phone
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
