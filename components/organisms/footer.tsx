"use client"

import Link from "next/link"
import { Logo } from "@/components/atoms/logo"
import { SocialLinks } from "@/components/molecules/social-links"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo variant="light" />
            <p className="mt-4 text-gray-400 max-w-md">
              Your trusted partner in creating unforgettable wedding experiences. Plan, organize, and celebrate your
              special day with ease.
            </p>
            <SocialLinks className="mt-6" />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/venues" className="hover:text-white transition-colors">
                  Venues
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-white transition-colors">
                  Vendors
                </Link>
              </li>
              <li>
                <Link href="/planning" className="hover:text-white transition-colors">
                  Planning Tools
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Wedding.lk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


export default Footer
