"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserPlus, Mail, Phone, Search } from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  category: "family" | "friends" | "colleagues" | "plus-one"
  side: "bride" | "groom" | "both"
  rsvp: "pending" | "attending" | "declined"
  dietaryRestrictions: string
  plusOne: boolean
}

export function GuestList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterRSVP, setFilterRSVP] = useState("all")

  const [guests, setGuests] = useState<Guest[]>([
    {
      id: "1",
      name: "Saman Kumara",
      email: "saman@email.com",
      phone: "+94 77 123 4567",
      category: "family",
      side: "groom",
      rsvp: "attending",
      dietaryRestrictions: "Vegetarian",
      plusOne: true,
    },
    {
      id: "2",
      name: "Nimal Perera",
      email: "nimal@email.com",
      phone: "+94 71 234 5678",
      category: "friends",
      side: "groom",
      rsvp: "pending",
      dietaryRestrictions: "",
      plusOne: false,
    },
    {
      id: "3",
      name: "Kamala Silva",
      email: "kamala@email.com",
      phone: "+94 76 345 6789",
      category: "family",
      side: "bride",
      rsvp: "attending",
      dietaryRestrictions: "",
      plusOne: true,
    },
    {
      id: "4",
      name: "Ruwan Fernando",
      email: "ruwan@email.com",
      phone: "+94 75 456 7890",
      category: "colleagues",
      side: "both",
      rsvp: "declined",
      dietaryRestrictions: "Gluten-free",
      plusOne: false,
    },
    {
      id: "5",
      name: "Sanduni Rajapaksa",
      email: "sanduni@email.com",
      phone: "+94 78 567 8901",
      category: "friends",
      side: "bride",
      rsvp: "attending",
      dietaryRestrictions: "",
      plusOne: true,
    },
  ])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editGuest, setEditGuest] = useState<Guest | null>(null)
  const [guestForm, setGuestForm] = useState<any>({ name: "", email: "", phone: "", category: "family", side: "bride", rsvp: "pending", dietaryRestrictions: "", plusOne: false })
  const [guestFormErrors, setGuestFormErrors] = useState<any>({})
  const [isGuestSaving, setIsGuestSaving] = useState(false)
  const { toast } = useToast()

  const openAddGuest = () => { setGuestForm({ name: "", email: "", phone: "", category: "family", side: "bride", rsvp: "pending", dietaryRestrictions: "", plusOne: false }); setGuestFormErrors({}); setIsAddOpen(true) }
  const openEditGuest = (guest: Guest) => { setEditGuest(guest); setGuestForm({ ...guest }); setGuestFormErrors({}); setIsEditOpen(true) }

  const handleSaveGuest = async () => {
    let err: any = {}
    if (!guestForm.name) err.name = "Name is required"
    if (!guestForm.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guestForm.email)) err.email = "Valid email required"
    if (!guestForm.phone || !/^\+?\d{10,15}$/.test(guestForm.phone.replace(/\s/g, ""))) err.phone = "Valid phone required"
    setGuestFormErrors(err)
    if (Object.keys(err).length > 0) return
    setIsGuestSaving(true)
    await new Promise(res => setTimeout(res, 800))
    if (isAddOpen) {
      setGuests(prev => [...prev, { ...guestForm, id: Date.now().toString() }])
      toast({ title: "Guest added!", variant: "default" })
      setIsAddOpen(false)
    } else if (isEditOpen && editGuest) {
      setGuests(prev => prev.map(g => g.id === editGuest.id ? { ...guestForm, id: editGuest.id } : g))
      toast({ title: "Guest updated!", variant: "default" })
      setIsEditOpen(false)
      setEditGuest(null)
    }
    setIsGuestSaving(false)
  }

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast({ title: `${label} copied!`, variant: "default" })
  }

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || guest.category === filterCategory
    const matchesRSVP = filterRSVP === "all" || guest.rsvp === filterRSVP

    return matchesSearch && matchesCategory && matchesRSVP
  })

  const totalGuests = guests.length
  const attendingGuests = guests.filter((g) => g.rsvp === "attending").length
  const pendingGuests = guests.filter((g) => g.rsvp === "pending").length
  const declinedGuests = guests.filter((g) => g.rsvp === "declined").length
  const totalWithPlusOnes = guests.reduce((sum, guest) => {
    return sum + (guest.rsvp === "attending" ? (guest.plusOne ? 2 : 1) : 0)
  }, 0)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "family":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
      case "friends":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "colleagues":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "plus-one":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRSVPColor = (rsvp: string) => {
    switch (rsvp) {
      case "attending":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Guest Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalGuests}</div>
            <div className="text-sm text-gray-500">Total Invited</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{attendingGuests}</div>
            <div className="text-sm text-gray-500">Attending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingGuests}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{declinedGuests}</div>
            <div className="text-sm text-gray-500">Declined</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalWithPlusOnes}</div>
            <div className="text-sm text-gray-500">Final Count</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-rose-600" />
            Guest Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search guests by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="colleagues">Colleagues</SelectItem>
                <SelectItem value="plus-one">Plus One</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRSVP} onValueChange={setFilterRSVP}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by RSVP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All RSVP Status</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Guest List */}
      <div className="space-y-4">
        {filteredGuests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-400">
              <div className="text-5xl mb-2">👥</div>
              <div>No guests found. Add your first guest!</div>
            </CardContent>
          </Card>
        ) : filteredGuests.map((guest, index) => (
          <motion.div
            key={guest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{guest.name}</h3>
                      <Badge className={getCategoryColor(guest.category)}>{guest.category}</Badge>
                      <Badge className={getRSVPColor(guest.rsvp)}>{guest.rsvp}</Badge>
                      {guest.plusOne && <Badge variant="outline">+1</Badge>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="cursor-pointer underline" onClick={() => handleCopy(guest.email, "Email")}>{guest.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="cursor-pointer underline" onClick={() => handleCopy(guest.phone, "Phone")}>{guest.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {guest.side} side
                      </div>
                    </div>
                    {guest.dietaryRestrictions && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Dietary:</span> {guest.dietaryRestrictions}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditGuest(guest)}>
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Guest Button */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" onClick={openAddGuest}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Guest
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Guest</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Name" value={guestForm.name} onChange={e => setGuestForm({ ...guestForm, name: e.target.value })} aria-invalid={!!guestFormErrors.name} aria-describedby={guestFormErrors.name ? "guest-name-error" : undefined} />
                {guestFormErrors.name && <div id="guest-name-error" className="text-xs text-destructive">{guestFormErrors.name}</div>}
                <Input placeholder="Email" value={guestForm.email} onChange={e => setGuestForm({ ...guestForm, email: e.target.value })} aria-invalid={!!guestFormErrors.email} aria-describedby={guestFormErrors.email ? "guest-email-error" : undefined} />
                {guestFormErrors.email && <div id="guest-email-error" className="text-xs text-destructive">{guestFormErrors.email}</div>}
                <Input placeholder="Phone" value={guestForm.phone} onChange={e => setGuestForm({ ...guestForm, phone: e.target.value })} aria-invalid={!!guestFormErrors.phone} aria-describedby={guestFormErrors.phone ? "guest-phone-error" : undefined} />
                {guestFormErrors.phone && <div id="guest-phone-error" className="text-xs text-destructive">{guestFormErrors.phone}</div>}
                <Select value={guestForm.category} onValueChange={v => setGuestForm({ ...guestForm, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="colleagues">Colleagues</SelectItem>
                    <SelectItem value="plus-one">Plus One</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={guestForm.side} onValueChange={v => setGuestForm({ ...guestForm, side: v })}>
                  <SelectTrigger><SelectValue placeholder="Side" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride</SelectItem>
                    <SelectItem value="groom">Groom</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={guestForm.rsvp} onValueChange={v => setGuestForm({ ...guestForm, rsvp: v })}>
                  <SelectTrigger><SelectValue placeholder="RSVP" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="attending">Attending</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Dietary Restrictions" value={guestForm.dietaryRestrictions} onChange={e => setGuestForm({ ...guestForm, dietaryRestrictions: e.target.value })} />
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="plusOne" checked={guestForm.plusOne} onChange={e => setGuestForm({ ...guestForm, plusOne: e.target.checked })} />
                  <label htmlFor="plusOne">Plus One</label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveGuest} disabled={isGuestSaving}>{isGuestSaving ? "Saving..." : "Add Guest"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Guest</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Name" value={guestForm.name} onChange={e => setGuestForm({ ...guestForm, name: e.target.value })} aria-invalid={!!guestFormErrors.name} aria-describedby={guestFormErrors.name ? "edit-guest-name-error" : undefined} />
                {guestFormErrors.name && <div id="edit-guest-name-error" className="text-xs text-destructive">{guestFormErrors.name}</div>}
                <Input placeholder="Email" value={guestForm.email} onChange={e => setGuestForm({ ...guestForm, email: e.target.value })} aria-invalid={!!guestFormErrors.email} aria-describedby={guestFormErrors.email ? "edit-guest-email-error" : undefined} />
                {guestFormErrors.email && <div id="edit-guest-email-error" className="text-xs text-destructive">{guestFormErrors.email}</div>}
                <Input placeholder="Phone" value={guestForm.phone} onChange={e => setGuestForm({ ...guestForm, phone: e.target.value })} aria-invalid={!!guestFormErrors.phone} aria-describedby={guestFormErrors.phone ? "edit-guest-phone-error" : undefined} />
                {guestFormErrors.phone && <div id="edit-guest-phone-error" className="text-xs text-destructive">{guestFormErrors.phone}</div>}
                <Select value={guestForm.category} onValueChange={v => setGuestForm({ ...guestForm, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="colleagues">Colleagues</SelectItem>
                    <SelectItem value="plus-one">Plus One</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={guestForm.side} onValueChange={v => setGuestForm({ ...guestForm, side: v })}>
                  <SelectTrigger><SelectValue placeholder="Side" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride</SelectItem>
                    <SelectItem value="groom">Groom</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={guestForm.rsvp} onValueChange={v => setGuestForm({ ...guestForm, rsvp: v })}>
                  <SelectTrigger><SelectValue placeholder="RSVP" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="attending">Attending</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Dietary Restrictions" value={guestForm.dietaryRestrictions} onChange={e => setGuestForm({ ...guestForm, dietaryRestrictions: e.target.value })} />
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="edit-plusOne" checked={guestForm.plusOne} onChange={e => setGuestForm({ ...guestForm, plusOne: e.target.checked })} />
                  <label htmlFor="edit-plusOne">Plus One</label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveGuest} disabled={isGuestSaving}>{isGuestSaving ? "Saving..." : "Save Changes"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}


export default GuestList;
