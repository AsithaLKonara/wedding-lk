"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Send, Search, MoreVertical, Phone, Video, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FileAttachment, FileUpload } from '@/components/molecules/file-attachment'

interface Conversation {
  _id: string
  participants: Array<{
    _id: string
    name: string
    email: string
    image?: string
  }>
  lastMessage?: {
    content: string
    createdAt: string
    senderId: string
  }
  updatedAt: string
}

interface Message {
  _id: string
  content: string
  senderId: {
    _id: string
    name: string
    email: string
    image?: string
  }
  createdAt: string
  attachments?: Array<{
    id: string
    fileName: string
    filePath: string
    fileSize: number
    fileType: string
  }>
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    fetchConversations()
  }, [session, status, router])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation._id)
  }

  const handleFileSelect = async (file: File) => {
    if (!selectedConversation) return

    setUploadingFile(true)
    setSelectedFile(file)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('conversationId', selectedConversation._id)

      const response = await fetch('/api/messages/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        // File uploaded successfully, now send message with attachment
        await sendMessageWithAttachment(data.attachment.id)
      } else {
        throw new Error('File upload failed')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploadingFile(false)
      setSelectedFile(null)
      setShowFileUpload(false)
    }
  }

  const sendMessageWithAttachment = async (attachmentId: string) => {
    if (!selectedConversation) return

    const recipientId = selectedConversation.participants.find(
      p => p._id !== session?.user?.id
    )?._id

    if (!recipientId) return

    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipientId,
        content: newMessage || 'File attachment',
        conversationId: selectedConversation._id,
        attachmentId
      })
    })

    if (response.ok) {
      const data = await response.json()
      setMessages(prev => [...prev, data.message])
      setNewMessage('')
      fetchConversations()
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)

    try {
      const recipientId = selectedConversation.participants.find(
        p => p._id !== session?.user?.id
      )?._id

      if (!recipientId) return

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId,
          content: newMessage,
          conversationId: selectedConversation._id
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
        fetchConversations() // Refresh conversations to update last message
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p._id !== session?.user?.id)
  }

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation)
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with vendors and wedding planners</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    const otherParticipant = getOtherParticipant(conversation)
                    return (
                      <div
                        key={conversation._id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                          selectedConversation?._id === conversation._id ? 'bg-purple-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={otherParticipant?.image} />
                            <AvatarFallback>
                              {otherParticipant?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {otherParticipant?.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {conversation.lastMessage?.createdAt
                              ? new Date(conversation.lastMessage.createdAt).toLocaleDateString()
                              : new Date(conversation.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No conversations found</p>
                    <p className="text-sm">Start a conversation with a vendor or planner</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={getOtherParticipant(selectedConversation)?.image} />
                        <AvatarFallback>
                          {getOtherParticipant(selectedConversation)?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {getOtherParticipant(selectedConversation)?.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {getOtherParticipant(selectedConversation)?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="p-0">
                  <div className="h-[calc(100vh-400px)] overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => {
                        const isOwnMessage = message.senderId._id === session?.user?.id
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isOwnMessage
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              {message.content && (
                                <p className="text-sm">{message.content}</p>
                              )}
                              
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map((attachment) => (
                                    <FileAttachment
                                      key={attachment.id}
                                      fileName={attachment.fileName}
                                      filePath={attachment.filePath}
                                      fileSize={attachment.fileSize}
                                      fileType={attachment.fileType}
                                    />
                                  ))}
                                </div>
                              )}
                              
                              <p className={`text-xs mt-1 ${
                                isOwnMessage ? 'text-purple-100' : 'text-gray-500'
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    )}
                  </div>

                  {/* File Upload */}
                  {showFileUpload && (
                    <div className="border-t p-4">
                      <FileUpload
                        onFileSelect={handleFileSelect}
                        disabled={uploadingFile}
                      />
                      {uploadingFile && (
                        <div className="mt-2 text-center text-sm text-gray-600">
                          Uploading file...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFileUpload(!showFileUpload)}
                        className="flex-shrink-0"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={sending || (!newMessage.trim() && !selectedFile)}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
