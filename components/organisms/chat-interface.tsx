"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/hooks/use-socket'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  File,
  Smile,
  MoreVertical,
  Edit,
  Trash2,
  Reply,
  Phone,
  Video,
  Search,
  Archive,
  Pin,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Check,
  CheckCheck,
  X,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  _id: string
  content: string
  sender: {
    _id: string
    firstName: string
    lastName: string
    email: string
    profileImage?: string
    userType: string
  }
  recipient: {
    _id: string
    firstName: string
    lastName: string
    email: string
    profileImage?: string
    userType: string
  }
  messageType: string
  attachments: Array<{
    type: string
    url: string
    filename: string
    size: number
    mimeType: string
  }>
  isRead: boolean
  isDelivered: boolean
  isEdited: boolean
  createdAt: string
  replyTo?: {
    _id: string
    content: string
    sender: {
      firstName: string
      lastName: string
    }
  }
  reactions: Array<{
    user: {
      _id: string
      firstName: string
      lastName: string
    }
    emoji: string
  }>
}

interface Conversation {
  _id: string
  participants: Array<{
    user: {
      _id: string
      firstName: string
      lastName: string
      email: string
      profileImage?: string
      userType: string
    }
    role: string
    isActive: boolean
  }>
  conversationType: string
  title?: string
  lastMessage?: {
    content: string
    sender: {
      _id: string
      firstName: string
      lastName: string
    }
    timestamp: string
    messageType: string
  }
  unreadCount: number
  isPinned: boolean
  bookingId?: {
    _id: string
    bookingNumber: string
    date: string
  }
  venueId?: {
    _id: string
    name: string
  }
  vendorId?: {
    _id: string
    businessName: string
  }
}

interface ChatInterfaceProps {
  conversationId?: string
  onConversationSelect?: (conversation: Conversation) => void
  className?: string
}

export function ChatInterface({ conversationId, onConversationSelect, className = "" }: ChatInterfaceProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [showConversations, setShowConversations] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [messageOffset, setMessageOffset] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    isConnected,
    sendMessage: socketSendMessage,
  } = useSocket()

  // Load conversations
  useEffect(() => {
    if (session?.user?.email) {
      loadConversations()
    }
  }, [session])

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id)
      setMessageOffset(0)
      setHasMoreMessages(true)
    }
  }, [selectedConversation])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Connect to socket when conversation is selected
  useEffect(() => {
    if (selectedConversation && !isConnected) {
      // The original code had connect() here, but useSocket doesn't expose a direct connect/disconnect.
      // This part of the logic needs to be re-evaluated based on the actual useSocket implementation.
      // For now, removing the line as it's not directly available from useSocket.
    }
  }, [selectedConversation, isConnected])

  async function loadConversations() {
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      
      if (data.success) {
        setConversations(data.conversations)
        
        // Auto-select conversation if conversationId is provided
        if (conversationId && !selectedConversation) {
          const conversation = data.conversations.find((c: Conversation) => c._id === conversationId)
          if (conversation) {
            setSelectedConversation(conversation)
            onConversationSelect?.(conversation)
          }
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      })
    }
  }

  async function loadMessages(convId: string, offset = 0) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/messages?conversationId=${convId}&limit=50&offset=${offset}`)
      const data = await response.json()
      
      if (data.success) {
        if (offset === 0) {
          setMessages(data.messages)
        } else {
          setMessages(prev => [...data.messages, ...prev])
        }
        setHasMoreMessages(data.hasMore)
        setMessageOffset(offset + data.messages.length)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleNewMessage(message: any) {
    if (selectedConversation && message.conversationId === selectedConversation._id) {
      setMessages(prev => [...prev, message])
      
      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv._id === selectedConversation._id 
            ? { ...conv, lastMessage: message, unreadCount: conv.unreadCount + 1 }
            : conv
        )
      )
    }
  }

  function handleNotification(notification: any) {
    if (notification.type === 'new_message') {
      toast({
        title: notification.title,
        description: notification.message,
        duration: 3000,
      })
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const messageData = {
        conversationId: selectedConversation._id,
        content: newMessage.trim(),
        messageType: 'text',
        replyTo: replyTo?._id,
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })

      const data = await response.json()
      
      if (data.success) {
        setNewMessage("")
        setReplyTo(null)
        setEditingMessage(null)
        
        // Add message to local state
        setMessages(prev => [...prev, data.message])
        
        // Update conversation last message
        setConversations(prev => 
          prev.map(conv => 
            conv._id === selectedConversation._id 
              ? { ...conv, lastMessage: data.message, unreadCount: 0 }
              : conv
          )
        )
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
  }

  async function editMessage(message: Message, newContent: string) {
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: message._id,
          content: newContent,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg._id === message._id ? data.message : msg
          )
        )
        setEditingMessage(null)
      }
    } catch (error) {
      console.error('Error editing message:', error)
      toast({
        title: "Error",
        description: "Failed to edit message",
        variant: "destructive",
      })
    }
  }

  async function deleteMessage(message: Message) {
    try {
      const response = await fetch(`/api/messages?messageId=${message._id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => prev.filter(msg => msg._id !== message._id))
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Handle file upload logic here
    // For now, just show a toast
    toast({
      title: "File Upload",
      description: "File upload feature coming soon!",
    })
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleKeyPress(event: React.KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  function getConversationTitle(conversation: Conversation) {
    if (conversation.title) return conversation.title
    
    if (conversation.conversationType === 'direct') {
      const otherParticipant = conversation.participants.find(
        p => p.user._id !== session?.user?.id
      )
      return otherParticipant ? `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}` : 'Direct Message'
    }
    
    return 'Group Conversation'
  }

  function getMessageStatus(message: Message) {
    if (message.isRead) return <CheckCheck className="h-3 w-3 text-blue-500" />
    if (message.isDelivered) return <CheckCheck className="h-3 w-3 text-gray-400" />
    return <Check className="h-3 w-3 text-gray-400" />
  }

  const filteredConversations = conversations.filter(conv =>
    getConversationTitle(conv).toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`flex h-full ${className}`}>
      {/* Conversations List */}
      <div className={`w-80 border-r bg-gray-50 ${showConversations ? 'block' : 'hidden md:block'}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConversations(false)}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation._id}
                className={`cursor-pointer transition-all hover:shadow-md mb-2 ${
                  selectedConversation?._id === conversation._id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedConversation(conversation)
                  onConversationSelect?.(conversation)
                  setShowConversations(false)
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.participants[0]?.user.profileImage} />
                      <AvatarFallback>
                        {conversation.participants[0]?.user.firstName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {getConversationTitle(conversation)}
                        </h4>
                        <div className="flex items-center gap-1">
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                            </Badge>
                          )}
                          {conversation.isPinned && <Pin className="h-3 w-3 text-gray-400" />}
                        </div>
                      </div>
                      
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage.sender.firstName}: {conversation.lastMessage.content}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {conversation.lastMessage 
                          ? formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })
                          : 'No messages yet'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConversations(true)}
                    className="md:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.participants[0]?.user.profileImage} />
                    <AvatarFallback>
                      {selectedConversation.participants[0]?.user.firstName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold">{getConversationTitle(selectedConversation)}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {isConnected ? (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Online
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          Offline
                        </div>
                      )}
                      {typingUsers.length > 0 && (
                        <span className="text-blue-500">typing...</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {isLoading && (
                  <div className="text-center text-gray-500">Loading messages...</div>
                )}
                
                {hasMoreMessages && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadMessages(selectedConversation._id, messageOffset)}
                    className="w-full"
                  >
                    Load more messages
                  </Button>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender._id === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.sender._id === session?.user?.id ? 'order-2' : 'order-1'}`}>
                      {message.sender._id !== session?.user?.id && (
                        <Avatar className="h-8 w-8 mb-1">
                          <AvatarImage src={message.sender.profileImage} />
                          <AvatarFallback>{message.sender.firstName[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`rounded-lg p-3 ${
                        message.sender._id === session?.user?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {replyTo && replyTo._id === message._id && (
                          <div className="text-xs opacity-70 mb-1">
                            Replying to {message.sender.firstName}
                          </div>
                        )}
                        
                        {message.replyTo && (
                          <div className="text-xs opacity-70 mb-1 border-l-2 pl-2">
                            {message.replyTo.sender.firstName}: {message.replyTo.content}
                          </div>
                        )}
                        
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            {editingMessage?._id === message._id ? (
                              <Textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="min-h-[60px] resize-none"
                                autoFocus
                              />
                            ) : (
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            )}
                            
                            {message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs">
                                    {attachment.type === 'image' ? (
                                      <ImageIcon className="h-3 w-3" />
                                    ) : (
                                      <File className="h-3 w-3" />
                                    )}
                                    <span>{attachment.filename}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {message.sender._id === session?.user?.id && (
                            <div className="flex items-center gap-1">
                              {getMessageStatus(message)}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingMessage(message)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMessage(message)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                          <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
                          {message.isEdited && <span>(edited)</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              {replyTo && (
                <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Replying to {replyTo.sender.firstName}: {replyTo.content}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="min-h-[60px] max-h-32 resize-none"
                    rows={1}
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInterface 