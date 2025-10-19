"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Search,
  Filter,
  Star,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
  type: 'couple' | 'vendor'
}

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file'
  isRead: boolean
  isDelivered: boolean
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Sarah & John',
      avatar: '/placeholder-avatar.jpg',
      lastMessage: 'Thank you for the quote! We\'d like to book your photography services.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      unreadCount: 2,
      isOnline: true,
      type: 'couple'
    },
    {
      id: '2',
      name: 'Royal Garden Hotel',
      avatar: '/placeholder-avatar.jpg',
      lastMessage: 'We have availability for your preferred date. Shall we schedule a site visit?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 0,
      isOnline: false,
      type: 'vendor'
    },
    {
      id: '3',
      name: 'Priya & Raj',
      avatar: '/placeholder-avatar.jpg',
      lastMessage: 'Could you share more photos from your portfolio?',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      unreadCount: 1,
      isOnline: true,
      type: 'couple'
    },
    {
      id: '4',
      name: 'Blissful Blooms',
      avatar: '/placeholder-avatar.jpg',
      lastMessage: 'Your flower arrangements are ready for pickup tomorrow.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unreadCount: 0,
      isOnline: false,
      type: 'vendor'
    }
  ])

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        senderId: '1',
        senderName: 'Sarah & John',
        content: 'Hi! We\'re interested in your photography services for our beach wedding in Galle.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: 'text',
        isRead: true,
        isDelivered: true
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'Me',
        content: 'Hello! I\'d love to help capture your special day. I specialize in beach weddings and have extensive experience in Galle.',
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        type: 'text',
        isRead: true,
        isDelivered: true
      },
      {
        id: '3',
        senderId: '1',
        senderName: 'Sarah & John',
        content: 'That sounds perfect! Could you please share your portfolio and pricing?',
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        type: 'text',
        isRead: true,
        isDelivered: true
      },
      {
        id: '4',
        senderId: 'me',
        senderName: 'Me',
        content: 'Of course! I\'ll send you my portfolio and pricing details. My beach wedding package includes 8 hours of coverage, edited photos, and an online gallery.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        type: 'text',
        isRead: true,
        isDelivered: true
      },
      {
        id: '5',
        senderId: '1',
        senderName: 'Sarah & John',
        content: 'Thank you for the quote! We\'d like to book your photography services.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'text',
        isRead: false,
        isDelivered: true
      }
    ]
  })

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedChatData = chats.find(chat => chat.id === selectedChat)
  const selectedMessages = selectedChat ? messages[selectedChat] || [] : []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedMessages])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Me',
      content: message,
      timestamp: new Date(),
      type: 'text',
      isRead: false,
      isDelivered: false
    }

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }))

    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Messages
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Communicate with couples, vendors, and venue managers
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
              {/* Chat List */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Filter className="h-3 w-3 mr-1" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto p-0">
                    <div className="space-y-1">
                      {filteredChats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChat(chat.id)}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-l-4 transition-colors ${
                            selectedChat === chat.id 
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                              : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={chat.avatar} alt={chat.name} />
                                <AvatarFallback>
                                  {chat.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {chat.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {chat.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    {formatTime(chat.timestamp)}
                                  </span>
                                  {chat.unreadCount > 0 && (
                                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                      {chat.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {chat.type}
                                </Badge>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {chat.lastMessage}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-3">
                <Card className="h-full flex flex-col">
                  {selectedChatData ? (
                    <>
                      {/* Chat Header */}
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={selectedChatData.avatar} alt={selectedChatData.name} />
                                <AvatarFallback>
                                  {selectedChatData.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {selectedChatData.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {selectedChatData.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {selectedChatData.isOnline ? 'Online' : 'Last seen recently'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {/* Messages */}
                      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {selectedMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${msg.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                              {msg.senderId !== 'me' && (
                                <p className="text-xs text-gray-500 mb-1">{msg.senderName}</p>
                              )}
                              <div className={`rounded-lg p-3 ${
                                msg.senderId === 'me' 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              }`}>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <div className={`flex items-center gap-1 mt-1 ${
                                msg.senderId === 'me' ? 'justify-end' : 'justify-start'
                              }`}>
                                <span className="text-xs text-gray-500">
                                  {formatTime(msg.timestamp)}
                                </span>
                                {msg.senderId === 'me' && (
                                  <div className="flex items-center">
                                    {msg.isDelivered ? (
                                      msg.isRead ? (
                                        <CheckCheck className="h-3 w-3 text-blue-500" />
                                      ) : (
                                        <CheckCheck className="h-3 w-3 text-gray-400" />
                                      )
                                    ) : (
                                      <Check className="h-3 w-3 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </CardContent>

                      {/* Message Input */}
                      <div className="border-t p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1"
                          />
                          <Button variant="outline" size="sm">
                            <Smile className="h-4 w-4" />
                          </Button>
                          <Button onClick={handleSendMessage} disabled={!message.trim()}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Select a conversation
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Choose a conversation from the list to start messaging
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
