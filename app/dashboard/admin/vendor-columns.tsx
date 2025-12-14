"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, CheckCircle, XCircle, Eye, Store } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Vendor = {
  _id: string
  businessName: string
  name: string
  email: string
  category: string
  location: {
    city: string
    province: string
  }
  isVerified: boolean
  isActive: boolean
  rating: {
    average: number
    count: number
  }
  createdAt: string
  owner: {
    name: string
    email: string
  }
}

export const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "businessName",
    header: "Business",
    cell: ({ row }) => {
      const vendor = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Store className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{vendor?.businessName || 'N/A'}</div>
            <div className="text-sm text-gray-500">{vendor?.owner?.name || 'N/A'}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      return (
        <Badge variant="outline">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const vendor = row.original
      return (
        <div className="text-sm text-gray-600">
          {vendor?.location?.city || 'N/A'}, {vendor?.location?.province || 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const vendor = row.original
      return (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="font-medium">{vendor.rating.average}</span>
            <span className="text-sm text-gray-500 ml-1">/5</span>
          </div>
          <span className="text-sm text-gray-500">
            ({vendor.rating.count} reviews)
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const vendor = row.original
      return (
        <div className="flex items-center space-x-2">
          {vendor.isVerified ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Pending
            </Badge>
          )}
          {vendor.isActive ? (
            <Badge variant="outline" className="text-green-600">
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="text-red-600">
              Inactive
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Applied",
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
      const vendor = row.original

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
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!vendor.isVerified && (
              <DropdownMenuItem 
                onClick={() => window.dispatchEvent(new CustomEvent('vendorAction', { detail: { vendorId: vendor._id, action: 'approve' } }))}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
            {!vendor.isVerified && (
              <DropdownMenuItem 
                onClick={() => window.dispatchEvent(new CustomEvent('vendorAction', { detail: { vendorId: vendor._id, action: 'reject' } }))}
                className="text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            )}
            {vendor.isActive && vendor.isVerified && (
              <DropdownMenuItem 
                onClick={() => window.dispatchEvent(new CustomEvent('vendorAction', { detail: { vendorId: vendor._id, action: 'suspend' } }))}
                className="text-orange-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Suspend
              </DropdownMenuItem>
            )}
            {!vendor.isActive && vendor.isVerified && (
              <DropdownMenuItem 
                onClick={() => window.dispatchEvent(new CustomEvent('vendorAction', { detail: { vendorId: vendor._id, action: 'activate' } }))}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 