"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Booking = {
  _id: string
  client: {
    name: string
    email: string
    phone: string
  }
  venue?: {
    name: string
    location: string
  }
  date: string
  startTime?: string
  endTime?: string
  totalAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
  createdAt: string
}

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const booking = row.original
      return (
        <div>
          <div className="font-medium">{booking.client.name}</div>
          <div className="text-sm text-gray-500">{booking.client.email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "venue",
    header: "Venue",
    cell: ({ row }) => {
      const booking = row.original
      if (!booking.venue) return <span className="text-gray-400">-</span>
      return (
        <div>
          <div className="font-medium">{booking.venue.name}</div>
          <div className="text-sm text-gray-500">{booking.venue.location}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Date & Time",
    cell: ({ row }) => {
      const booking = row.original
      const date = new Date(booking.date)
      const dateText = date.toLocaleDateString()
      
      let timeText = ''
      if (booking.startTime && booking.endTime) {
        timeText = `${booking.startTime} - ${booking.endTime}`
      } else if (booking.startTime) {
        timeText = booking.startTime
      }
      
      return (
        <div>
          <div className="font-medium">{dateText}</div>
          {timeText && (
            <div className="text-sm text-gray-500">{timeText}</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number
      return (
        <div className="font-medium">
          LKR {amount.toLocaleString()}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusConfig = {
        pending: { label: 'Pending', variant: 'secondary', icon: Clock },
        confirmed: { label: 'Confirmed', variant: 'default', icon: CheckCircle },
        completed: { label: 'Completed', variant: 'default', icon: CheckCircle },
        cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
        rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle }
      }
      
      const config = statusConfig[status as keyof typeof statusConfig]
      const Icon = config.icon
      
      return (
        <Badge variant={config.variant as any}>
          <Icon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Booked",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <div className="text-sm text-gray-500">
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {booking.status === 'pending' && (
              <>
                <DropdownMenuItem 
                  onClick={() => window.dispatchEvent(new CustomEvent('bookingAction', { detail: { bookingId: booking._id, action: 'confirm' } }))}
                  className="text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.dispatchEvent(new CustomEvent('bookingAction', { detail: { bookingId: booking._id, action: 'reject' } }))}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {booking.status === 'confirmed' && (
              <DropdownMenuItem 
                onClick={() => window.dispatchEvent(new CustomEvent('bookingAction', { detail: { bookingId: booking._id, action: 'complete' } }))}
                className="text-blue-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Complete
              </DropdownMenuItem>
            )}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <DropdownMenuItem 
                onClick={() => window.dispatchEvent(new CustomEvent('bookingAction', { detail: { bookingId: booking._id, action: 'cancel' } }))}
                className="text-orange-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 