"use client"

import { Button } from "@/components/ui/button"
import { Camera, Utensils, Music, Flower, Users, Car } from "lucide-react"

interface VendorCategoriesProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function VendorCategories({ selectedCategory, onCategoryChange }: VendorCategoriesProps) {
  const categories = [
    { id: "all", label: "All Categories", icon: Users },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "catering", label: "Catering", icon: Utensils },
    { id: "entertainment", label: "Entertainment", icon: Music },
    { id: "decoration", label: "Decoration", icon: Flower },
    { id: "transportation", label: "Transportation", icon: Car },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const IconComponent = category.icon
        return (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className="flex items-center space-x-2"
          >
            <IconComponent className="h-4 w-4" />
            <span>{category.label}</span>
          </Button>
        )
      })}
    </div>
  )
}


export default VendorCategories
