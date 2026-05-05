"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Loader2, 
  Minimize2, 
  Maximize2,
  RefreshCw,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/hooks/use-auth'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export function AIChatbot() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  
  useEffect(() => {
    // Set initial message on client side to avoid hydration mismatch
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm your WeddingLK AI assistant. I can help you find venues, vendors, or plan your perfect Sri Lankan wedding. What's on your mind?",
        timestamp: new Date(),
        suggestions: ["Find Beach Venues", "Photography Packages", "Traditional Music", "Budget Tips"]
      }
    ])
  }, [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          context: {
            user: user ? { id: user.id, name: user.name, type: user.role } : null,
            currentPage: window.location.pathname
          }
        })
      })

      const data = await response.json()
      
      if (data.response) {
        const botMessage: Message = {
          role: 'assistant',
          content: data.response.text,
          timestamp: new Date(),
          suggestions: data.response.suggestions
        }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Chatbot error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a little trouble connecting right now. Please try again in a moment!",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => setIsOpen(!isOpen)
  const toggleMinimize = () => setIsMinimized(!isMinimized)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px',
              width: '400px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 shadow-2xl rounded-3xl overflow-hidden border border-white/20 bg-white/80 backdrop-blur-xl dark:bg-gray-900/80"
          >
            <Card className="border-none bg-transparent h-full flex flex-col shadow-none">
              <CardHeader className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">WeddingLK AI</CardTitle>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white/80 font-medium">Online & Ready</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
                    onClick={toggleMinimize}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
                    onClick={toggleChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  <CardContent className="flex-1 p-0 overflow-hidden bg-gray-50/50 dark:bg-gray-950/50">
                    <ScrollArea className="h-full p-4" ref={scrollRef}>
                      <div className="space-y-4">
                        {messages.map((msg, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                              <Avatar className={`h-8 w-8 shrink-0 border-2 ${msg.role === 'assistant' ? 'border-purple-200' : 'border-pink-200'}`}>
                                {msg.role === 'assistant' ? (
                                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-full h-full flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-white" />
                                  </div>
                                ) : (
                                  <AvatarImage src={user?.image} />
                                )}
                                <AvatarFallback className="bg-gray-200 text-[10px]">
                                  {msg.role === 'assistant' ? 'AI' : 'ME'}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex flex-col gap-1.5">
                                <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                  msg.role === 'user' 
                                    ? 'bg-purple-600 text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
                                }`}>
                                  {msg.content}
                                </div>
                                {msg.suggestions && msg.suggestions.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {msg.suggestions.map((s, si) => (
                                      <button
                                        key={si}
                                        onClick={() => handleSend(s)}
                                        className="text-[11px] font-semibold bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors shadow-sm"
                                      >
                                        {s}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm">
                              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>

                  <CardFooter className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                    <div className="relative w-full group">
                      <Input
                        placeholder="Ask me anything about your wedding..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="pr-12 h-12 rounded-2xl bg-gray-50 border-gray-200 focus:ring-purple-500/20 dark:bg-gray-800 dark:border-gray-700"
                      />
                      <Button 
                        size="icon" 
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1.5 top-1.5 h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className={`relative h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-white text-purple-600 rotate-90' : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
        }`}
      >
        {isOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <>
            <MessageCircle className="h-7 w-7" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center"
            >
              <Sparkles className="h-3 w-3 text-purple-700" />
            </motion.div>
          </>
        )}
      </motion.button>
    </div>
  )
}

export default AIChatbot;
