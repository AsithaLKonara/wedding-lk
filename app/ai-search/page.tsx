"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, MapPin, Users, Calendar, Heart, Star, Camera, Music, Utensils } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AISuggestion {
  type: 'venue' | 'vendor' | 'package'
  title: string
  description: string
  location: string
  price?: string
  rating?: number
  image: string
  href: string
}

export default function AISearchPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI wedding planning assistant. Tell me about your dream wedding and I'll help you find the perfect venues, vendors, and create a personalized plan for your special day!",
      timestamp: new Date(),
      suggestions: [
        "I want a beach wedding in Galle for 150 guests",
        "Looking for a traditional Kandyan wedding in Kandy",
        "Need a photographer and caterer for my wedding",
        "Help me plan a budget-friendly wedding under 500k"
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate AI suggestions based on user input
      const aiSuggestions = generateAISuggestions(inputValue)
      setSuggestions(aiSuggestions)

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue, aiSuggestions),
        timestamp: new Date(),
        suggestions: [
          "Show me more venues like this",
          "What about photographers in this area?",
          "Help me with my budget planning",
          "Find vendors for my wedding theme"
        ]
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (input: string, suggestions: AISuggestion[]): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('beach') && lowerInput.includes('galle')) {
      return `Perfect! I found some amazing beach venues in Galle for your wedding. Galle is known for its beautiful coastline and historic charm. Here are my top recommendations that match your criteria:`
    } else if (lowerInput.includes('traditional') && lowerInput.includes('kandy')) {
      return `Excellent choice! Kandy offers some of the most beautiful traditional wedding venues in Sri Lanka. I've found venues that specialize in Kandyan weddings with authentic cultural elements:`
    } else if (lowerInput.includes('photographer') || lowerInput.includes('caterer')) {
      return `Great! I've identified the best photographers and caterers in your area. Here are my top recommendations based on your requirements and budget:`
    } else if (lowerInput.includes('budget')) {
      return `I understand you're looking for budget-friendly options. I've found some excellent venues and vendors that offer great value while maintaining quality. Here are my recommendations:`
    } else {
      return `Based on your requirements, I've found some fantastic options for your wedding. Here are my personalized recommendations:`
    }
  }

  const generateAISuggestions = (input: string): AISuggestion[] => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('beach') && lowerInput.includes('galle')) {
      return [
        {
          type: 'venue',
          title: 'Galle Fort Beach Resort',
          description: 'Historic beachfront venue with colonial charm',
          location: 'Galle Fort',
          price: 'LKR 200,000 - 350,000',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
          href: '/venues/galle-fort-beach-resort'
        },
        {
          type: 'venue',
          title: 'Unawatuna Beach Villa',
          description: 'Private beach villa with stunning ocean views',
          location: 'Unawatuna',
          price: 'LKR 150,000 - 280,000',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          href: '/venues/unawatuna-beach-villa'
        },
        {
          type: 'vendor',
          title: 'Ocean Breeze Photography',
          description: 'Specializes in beach wedding photography',
          location: 'Galle',
          price: 'LKR 80,000 - 120,000',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
          href: '/vendors/ocean-breeze-photography'
        }
      ]
    } else if (lowerInput.includes('traditional') && lowerInput.includes('kandy')) {
      return [
        {
          type: 'venue',
          title: 'Kandyan Cultural Centre',
          description: 'Authentic traditional wedding venue with cultural performances',
          location: 'Kandy',
          price: 'LKR 180,000 - 300,000',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop',
          href: '/venues/kandyan-cultural-centre'
        },
        {
          type: 'vendor',
          title: 'Heritage Drummers',
          description: 'Traditional Kandyan drumming and dancing troupe',
          location: 'Kandy',
          price: 'LKR 50,000 - 80,000',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
          href: '/vendors/heritage-drummers'
        }
      ]
    } else {
      return [
        {
          type: 'venue',
          title: 'Royal Garden Hotel',
          description: 'Elegant hotel with beautiful garden setting',
          location: 'Colombo',
          price: 'LKR 250,000 - 400,000',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=400&h=300&fit=crop',
          href: '/venues/royal-garden-hotel'
        },
        {
          type: 'vendor',
          title: 'Elegant Photography Studio',
          description: 'Professional wedding photography services',
          location: 'Colombo',
          price: 'LKR 100,000 - 150,000',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
          href: '/vendors/elegant-photography-studio'
        }
      ]
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'venue': return <MapPin className="h-4 w-4" />
      case 'vendor': return <Users className="h-4 w-4" />
      case 'package': return <Heart className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                AI Wedding Planning Assistant
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Describe your dream wedding and let AI help you find the perfect venues, vendors, and create your personalized wedding plan.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-blue-500" />
                      Wedding Planning Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}>
                            <div className="flex items-start gap-2">
                              {message.type === 'ai' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                              {message.type === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                              <div>
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            
                            {/* Suggestions */}
                            {message.suggestions && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs opacity-70">Quick suggestions:</p>
                                <div className="flex flex-wrap gap-2">
                                  {message.suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleSuggestionClick(suggestion)}
                                      className="text-xs px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4" />
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Describe your dream wedding..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Suggestions */}
              <div className="space-y-6">
                {suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start gap-3">
                            <img
                              src={suggestion.image}
                              alt={suggestion.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getIconForType(suggestion.type)}
                                <Badge variant="outline" className="text-xs">
                                  {suggestion.type}
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                {suggestion.description}
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {suggestion.location}
                                </span>
                                {suggestion.rating && (
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {suggestion.rating}
                                  </span>
                                )}
                              </div>
                              {suggestion.price && (
                                <p className="text-xs font-medium text-green-600 mt-1">
                                  {suggestion.price}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Plan My Timeline
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Find Vendors
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Browse Venues
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="h-4 w-4 mr-2" />
                      Save My Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
