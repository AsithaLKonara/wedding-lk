"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

interface SimpleLayoutProps {
  children: React.ReactNode
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-rose-500 fill-current" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Wedding.lk</span>
            </Link>
            
            <nav className="hidden lg:block">
              <div className="flex justify-center space-x-8 px-4 sm:px-6 lg:px-8">
                <Link href="/venues" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Venues</Link>
                <Link href="/vendors" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Vendors</Link>
                <Link href="/feed" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Feed</Link>
                <Link href="/gallery" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Gallery</Link>
                <Link href="/ai-search" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">AI Search</Link>
                <Link href="/chat" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Chat</Link>
                <Link href="/about" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">About</Link>
              </div>
            </nav>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Sign In</Link>
                <Link href="/register" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">Get Started</Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-rose-500 fill-current" />
                <span className="text-xl font-bold text-white">Wedding.lk</span>
              </Link>
              <p className="mt-4 text-gray-400 max-w-md">
                Your trusted partner in creating unforgettable wedding experiences. Plan, organize, and celebrate your special day with ease.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/venues" className="hover:text-white transition-colors">Venues</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">Vendors</Link></li>
                <li><Link href="/planning" className="hover:text-white transition-colors">Planning Tools</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Wedding.lk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
