"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Eye, ToggleLeft, ToggleRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Service = {
  _id: string
  name: string
  description: string
  category: string
  price: number
  priceType: 'fixed' | 'per-person' | 'per-hour'
  duration?: number
  isActive: boolean
  images?: string[]
  features?: string[]
  createdAt: string
}

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: "Service",
    cell: ({ row }) => {
      const service = row.original
      return (
        <div>
          <div className="font-medium">{service.name}</div>
          <div className="text-sm text-gray-500 line-clamp-2">
            {service.description}
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
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const service = row.original
      const priceText = `LKR ${service.price.toLocaleString()}`
      
      let priceTypeText = ''
      switch (service.priceType) {
        case 'per-person':
          priceTypeText = 'per person'
          break
        case 'per-hour':
          priceTypeText = 'per hour'
          break
        default:
          priceTypeText = 'fixed'
      }
      
      return (
        <div>
          <div className="font-medium">{priceText}</div>
          <div className="text-sm text-gray-500">{priceTypeText}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number
      if (!duration) return <span className="text-gray-400">-</span>
      return (
        <div className="text-sm">
          {duration} hour{duration !== 1 ? 's' : ''}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const service = row.original
      return (
        <Badge variant={service.isActive ? "default" : "secondary"}>
          {service.isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
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
      const service = row.original

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
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Service
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {service.isActive ? (
              <DropdownMenuItem 
                onClick={() => window.dispatchEvent(new CustomEvent('serviceAction', { detail: { serviceId: service._id, action: 'deactivate' } }))}
                className="text-orange-600"
              >
                <ToggleLeft className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                onClick={() => window.dispatchEvent(new CustomEvent('serviceAction', { detail: { serviceId: service._id, action: 'activate' } }))}
                className="text-green-600"
              >
                <ToggleRight className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 