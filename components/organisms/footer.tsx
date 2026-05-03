"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/atoms/logo"
import { SocialLinks } from "@/components/molecules/social-links"
import { useAuth } from "@/lib/hooks/use-auth"

export function Footer() {
  const { user } = useAuth();
  const router = useRouter()

  const handlePlanningToolsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (user) {
      router.push('/dashboard/user')
    } else {
      router.push('/auth/signin')
    }
  }

  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
              Your trusted partner in creating unforgettable wedding experiences. Plan, organize, and celebrate your special day with ease and elegance.
            </p>
            <div className="mt-8">
              <SocialLinks />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Services</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link href="/venues" className="hover:text-rose-500 transition-colors font-medium">
                  Venues
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-rose-500 transition-colors font-medium">
                  Vendors
                </Link>
              </li>
              <li>
                <button 
                  onClick={handlePlanningToolsClick}
                  className="hover:text-rose-500 transition-colors text-left font-medium"
                >
                  Planning Tools
                </button>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-rose-500 transition-colors font-medium">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-rose-500 transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-500 transition-colors font-medium">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-rose-500 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-rose-500 transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Wedding.lk. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/cookies" className="hover:text-rose-500 transition-colors">Cookies</Link>
            <Link href="/sitemap" className="hover:text-rose-500 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


export default Footer
