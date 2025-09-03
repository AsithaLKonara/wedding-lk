"use client"

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SocialLinksProps {
  className?: string
}

export function SocialLinks({ className = "" }: SocialLinksProps) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
        <Instagram className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
        <Youtube className="h-4 w-4" />
      </Button>
    </div>
  )
}


export default SocialLinks
