"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Send, Paperclip, Image as ImageIcon, Smile, MoreVertical } from "lucide-react"
import Link from "next/link"

export default function MessagesContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [conversations, setConversations] = useState([
    {
      id: "1",
      name: "Perfect Moments Photography",
      lastMessage: "Looking forward to your wedding!",
      time: "10:30 AM",
      unread: 2,
      avatar: "/placeholder-user.jpg",
      status: "online"
    },
    {
      id: "2",
      name: "Grand Ballroom Hotel",
      lastMessage: "Your booking is confirmed.",
      time: "Yesterday",
      unread: 0,
      avatar: "/placeholder-user.jpg",
      status: "offline"
    },
    {
      id: "3",
      name: "Elegant Decorators",
      lastMessage: "Here are the new design options.",
      time: "2 days ago",
      unread: 1,
      avatar: "/placeholder-user.jpg",
      status: "online"
    },
    {
      id: "4",
      name: "Sweet Dreams Catering",
      lastMessage: "Menu tasting scheduled for next week.",
      time: "3 days ago",
      unread: 0,
      avatar: "/placeholder-user.jpg",
      status: "away"
    }
  ])
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messages, setMessages] = useState([
    { id: "m1", sender: "other", content: "Hi! How can I help you with your wedding photography?", time: "10:28 AM", status: "read" },
    { id: "m2", sender: "me", content: "I'd like to inquire about your wedding photography packages.", time: "10:30 AM", status: "read" },
    { id: "m3", sender: "other", content: "Certainly! We have several packages starting from LKR 150,000. What's your wedding date?", time: "10:35 AM", status: "read" },
    { id: "m4", sender: "me", content: "It's on December 15th, 2024. Can you tell me more about the packages?", time: "10:40 AM", status: "read" },
    { id: "m5", sender: "other", content: "Perfect! For December weddings, we offer special rates. Let me send you our package details.", time: "10:45 AM", status: "delivered" }
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
    } else if (status === 'unauthenticated') {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: `m${messages.length + 1}`,
        sender: "me",
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sending"
      }
      setMessages([...messages, message])
      setNewMessage("")
      
      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: "delivered" } : msg
        ))
      }, 1000)
      
      // Simulate typing response
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const response = {
            id: `m${messages.length + 2}`,
            sender: "other",
            content: "Thanks for your message! I'll get back to you soon.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "read"
          }
          setMessages(prev => [...prev, response])
        }, 2000)
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">Login to Messages</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/register">Create Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-900 max-w-7xl mx-auto">
      {/* Left Pane: Conversations List */}
      <div className="w-1/3 border-r bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                selectedConversation.id === conv.id ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500" : ""
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conv.avatar} alt={conv.name} />
                  <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  conv.status === 'online' ? 'bg-green-500' : 
                  conv.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{conv.name}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{conv.time}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{conv.lastMessage}</p>
                {conv.unread > 0 && (
                  <Badge variant="destructive" className="mt-1 text-xs">
                    {conv.unread}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Right Pane: Chat Interface */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {/* Chat Header */}
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
              <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h3 className="text-lg font-semibold">{selectedConversation.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedConversation.status === 'online' ? 'Online' : 
                 selectedConversation.status === 'away' ? 'Away' : 'Offline'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg relative ${
                    msg.sender === "me"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                    msg.sender === "me" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    <span className="text-xs">{msg.time}</span>
                    {msg.sender === "me" && (
                      <span className="text-xs">
                        {msg.status === "sending" ? "⏳" : 
                         msg.status === "delivered" ? "✓" : 
                         msg.status === "read" ? "✓✓" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg rounded-bl-none p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type your message..."
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 