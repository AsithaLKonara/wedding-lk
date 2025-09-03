"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationDropdownProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function LocationDropdown({ value, onChange, placeholder = "Select location" }: LocationDropdownProps) {
  const [open, setOpen] = useState(false)

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

  const allLocations = Object.entries(locations).flatMap(([province, cities]) =>
    cities.map((city) => ({ province, city, full: `${city}, ${province}` })),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-10">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
            {value || placeholder}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <div className="max-h-80 overflow-y-auto">
              {Object.entries(locations).map(([province, cities]) => (
                <CommandGroup key={province} heading={province}>
                  {cities.map((city) => (
                    <CommandItem
                      key={`${city}-${province}`}
                      value={`${city}, ${province}`}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", value === `${city}, ${province}` ? "opacity-100" : "opacity-0")}
                      />
                      <MapPin className="mr-2 h-3 w-3 text-gray-400" />
                      {city}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


export default LocationDropdown
