import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import RootProviders from "@/components/providers/root-providers"
import { CookieConsent } from "@/components/ui/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wedding Dreams Lanka - Plan Your Perfect Wedding",
  description: "Sri Lanka&apos;s premier wedding planning platform. Find venues, vendors, and plan your dream wedding.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <RootProviders>
          {children}
          <CookieConsent />
        </RootProviders>
      </body>
    </html>
  )
}
