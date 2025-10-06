import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Suspense } from "react"
import { PageLoading } from "@/components/ui/loading"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wedding Dreams Lanka - Plan Your Perfect Wedding",
  description: "Sri Lanka's premier wedding planning platform. Find venues, vendors, and plan your dream wedding.",
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
        <ErrorBoundary>
          <ThemeProvider>
            <Suspense fallback={<PageLoading />}>
              {children}
            </Suspense>
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
