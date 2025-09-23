export const SITE_CONFIG = {
  name: "Wedding Dreams Lanka",
  description: "Sri Lanka's premier wedding planning platform. Find venues, vendors, and plan your dream wedding.",
  url: "https://weddingdreamslanka.com",
  ogImage: "https://weddingdreamslanka.com/og.jpg",
  links: {
    twitter: "https://twitter.com/weddingdreamslk",
    facebook: "https://facebook.com/weddingdreamslanka",
    instagram: "https://instagram.com/weddingdreamslanka",
    linkedin: "https://linkedin.com/company/wedding-dreams-lanka",
  },
}

export const API_ROUTES = {
  USERS: "/api/users",
  VENUES: "/api/venues",
  VENDORS: "/api/vendors",
  BOOKINGS: "/api/bookings",
  PAYMENTS: "/api/payments",
  AUTH: "/api/auth",
} as const

export const APP_ROUTES = {
  HOME: "/",
  VENUES: "/venues",
  VENDORS: "/vendors",
  PLANNING: "/planning",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  LOGIN: "/login",
  REGISTER: "/register",
} as const

export const VENUE_CATEGORIES = [
  "Hotel",
  "Beach Resort",
  "Garden",
  "Banquet Hall",
  "Restaurant",
  "Villa",
  "Temple",
  "Church",
  "Other",
] as const

export const VENDOR_CATEGORIES = [
  "Photography",
  "Videography",
  "Catering",
  "Decoration",
  "Music & Entertainment",
  "Transportation",
  "Makeup & Hair",
  "Wedding Cake",
  "Flowers",
  "Jewelry",
  "Clothing",
  "Invitation Cards",
] as const

export const WEDDING_BUDGET_RANGES = [
  { label: "Under LKR 500,000", value: "0-500000" },
  { label: "LKR 500,000 - 1,000,000", value: "500000-1000000" },
  { label: "LKR 1,000,000 - 2,000,000", value: "1000000-2000000" },
  { label: "LKR 2,000,000 - 5,000,000", value: "2000000-5000000" },
  { label: "Above LKR 5,000,000", value: "5000000+" },
] as const

export const SRI_LANKAN_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Moneragala",
  "Ratnapura",
  "Kegalle",
] as const
