"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronDown, MapPin, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationDropdownProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function LocationDropdown({ value, onChange, placeholder = "Select location" }: LocationDropdownProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Sri Lankan locations organized like ikman.lk
  const locations = {
    "Western Province": [
      "Colombo",
      "Gampaha",
      "Kalutara",
      "Negombo",
      "Mount Lavinia",
      "Dehiwala",
      "Moratuwa",
      "Kelaniya",
      "Ja-Ela",
      "Wattala",
    ],
    "Central Province": [
      "Kandy",
      "Matale",
      "Nuwara Eliya",
      "Dambulla",
      "Sigiriya",
      "Peradeniya",
      "Gampola",
      "Nawalapitiya",
      "Hatton",
      "Bandarawela",
    ],
    "Southern Province": [
      "Galle",
      "Matara",
      "Hambantota",
      "Unawatuna",
      "Mirissa",
      "Weligama",
      "Tangalle",
      "Bentota",
      "Hikkaduwa",
      "Ahangama",
    ],
    "Northern Province": ["Jaffna", "Vavuniya", "Mannar", "Kilinochchi", "Mullaitivu"],
    "Eastern Province": ["Trincomalee", "Batticaloa", "Ampara", "Arugam Bay", "Pasikudah", "Kalkudah"],
    "North Western Province": ["Kurunegala", "Puttalam", "Chilaw", "Wariyapola"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa", "Habarana", "Mihintale"],
    "Uva Province": ["Badulla", "Monaragala", "Ella", "Bandarawela", "Haputale", "Wellawaya"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle", "Embilipitiya", "Balangoda", "Pelmadulla"],
  }

  const handleSelect = (city: string, province: string) => {
    const selectedVal = `${city}, ${province}`
    onChange(selectedVal === value ? "" : selectedVal)
    setOpen(false)
  }

  // Filter locations based on search query
  const filteredLocations = Object.entries(locations).reduce((acc, [province, cities]) => {
    const matchingCities = cities.filter(city => 
      city.toLowerCase().includes(searchQuery.toLowerCase()) || 
      province.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (matchingCities.length > 0) {
      acc[province] = matchingCities
    }
    return acc
  }, {} as Record<string, string[]>)

  const hasResults = Object.keys(filteredLocations).length > 0

  return (
    <Popover open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) setSearchQuery("")
    }}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-12 rounded-xl bg-muted/50 border-border/50 text-white">
          <div className="flex items-center">
            <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-white">{value || placeholder}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-2xl overflow-hidden border-border/50 shadow-2xl bg-card" align="start">
        <div className="flex flex-col max-h-[380px] bg-card text-white">
          {/* Search bar */}
          <div className="flex items-center border-b border-border/40 px-3 h-12 bg-card">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
            <input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-full w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-white border-none focus:ring-0"
            />
          </div>

          {/* List content */}
          <div className="overflow-y-auto max-h-[320px] p-2 space-y-3 custom-scrollbar">
            {!hasResults ? (
              <div className="p-6 text-sm text-center text-muted-foreground">No location found.</div>
            ) : (
              Object.entries(filteredLocations).map(([province, cities]) => (
                <div key={province} className="space-y-1.5">
                  <div className="px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">{province}</div>
                  <div className="space-y-0.5">
                    {cities.map((city) => {
                      const itemValue = `${city}, ${province}`
                      const isSelected = value === itemValue
                      return (
                        <button
                          key={itemValue}
                          type="button"
                          onClick={() => handleSelect(city, province)}
                          className={cn(
                            "w-full flex items-center rounded-xl px-3 py-2.5 text-sm transition-colors text-left",
                            isSelected 
                              ? "bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/20" 
                              : "text-gray-300 hover:bg-white/5 font-medium"
                          )}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 shrink-0 transition-opacity",
                              isSelected ? "opacity-100 text-rose-500" : "opacity-0"
                            )}
                          />
                          <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{city}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default LocationDropdown
