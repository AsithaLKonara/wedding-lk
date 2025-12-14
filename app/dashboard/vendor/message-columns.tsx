"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Reply, Archive } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Message = {
  _id: string
  conversationId: string
  client: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  messageType: 'text' | 'image' | 'file'
  direction: 'inbound' | 'outbound'
  isRead: boolean
  createdAt: string
}

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const message = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            {message.client.avatar ? (
              <img 
                src={message.client.avatar} 
                alt={message.client.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {message.client.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium">{message.client.name}</div>
            <div className="text-sm text-gray-500">{message.client.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "content",
    header: "Message",
    cell: ({ row }) => {
      const message = row.original
      const isOutbound = message.direction === 'outbound'
      
      return (
        <div className={`max-w-xs ${isOutbound ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-2 rounded-lg ${
            isOutbound 
              ? 'bg-blue-100 text-blue-900' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            <div className="text-sm line-clamp-2">
              {message.messageType === 'image' && '📷 Image'}
              {message.messageType === 'file' && '📎 File'}
              {message.messageType === 'text' && message.content}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "direction",
    header: "Type",
    cell: ({ row }) => {
      const direction = row.getValue("direction") as string
      const isOutbound = direction === 'outbound'
      
      return (
        <Badge variant={isOutbound ? "default" : "secondary"}>
          {isOutbound ? "Sent" : "Received"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "isRead",
    header: "Status",
    cell: ({ row }) => {
      const message = row.original
      const isOutbound = message.direction === 'outbound'
      
      if (isOutbound) {
        return (
          <Badge variant="outline" className="text-green-600">
            Sent
          </Badge>
        )
      }
      
      return (
        <Badge variant={message.isRead ? "secondary" : "default"}>
          {message.isRead ? "Read" : "Unread"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
      
      let timeText = ''
      if (diffInHours < 1) {
        timeText = 'Just now'
      } else if (diffInHours < 24) {
        timeText = `${diffInHours}h ago`
      } else {
        timeText = date.toLocaleDateString()
      }
      
      return (
        <div className="text-sm text-gray-500">
          {timeText}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const message = row.original

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
              View Full Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 