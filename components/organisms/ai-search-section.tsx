"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Users, Sparkles, Mic, MicOff } from "lucide-react"
import { LocationDropdown } from "@/components/molecules/location-dropdown"
import { AISearchResults } from "@/components/molecules/ai-search-results"

interface AISearchSectionProps {
  [key: string]: any;
}

export default function AISearchSection(props: AISearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [guestCount, setGuestCount] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [aiResults, setAiResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleAISearch = async () => {
    setIsSearching(true)

    // Simulate AI search with your API
    const searchData = {
      query: searchQuery,
      location: selectedLocation,
      date: selectedDate,
      guests: guestCount,
    }

    try {
      // Replace with your actual AI API endpoint
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      })

      const results = await response.json()
      if (results.success) {
        setAiResults(results.data)
      }
    } catch (error) {
      console.error("AI Search error:", error)
      // Show mock results for demo
      setAiResults({
        interpretation: {
          weddingStyle: "beach",
          budget: { min: 500000, max: 900000 },
          preferences: ["Live music", "Professional photography", "Beach location"],
        },
        recommendations: {
          venues: [
            {
              id: 1,
              name: "Seaside Paradise Resort",
              location: "Galle",
              rating: 4.9,
              price: 180000,
              image: "/placeholder.svg?height=200&width=300",
              matchScore: 95,
              reasons: ["Perfect beach location", "Accommodates your guest count", "Excellent reviews"],
            },
            {
              id: 2,
              name: "Garden Elegance Hotel",
              location: "Kandy",
              rating: 4.7,
              price: 150000,
              image: "/placeholder.svg?height=200&width=300",
              matchScore: 88,
              reasons: ["Beautiful garden setting", "Great catering options", "Professional service"],
            },
          ],
          vendors: [
            {
              id: 1,
              name: "Perfect Moments Photography",
              category: "Photography",
              rating: 4.9,
              price: 75000,
              matchScore: 92,
              reasons: ["Specializes in beach weddings", "Award-winning portfolio", "Excellent reviews"],
            },
            {
              id: 2,
              name: "Harmony Live Band",
              category: "Entertainment",
              rating: 4.8,
              price: 45000,
              matchScore: 89,
              reasons: ["Perfect for outdoor events", "Diverse music selection", "Professional setup"],
            },
          ],
          packages: [
            {
              id: 1,
              title: "Beach Wedding Premium Package",
              price: 850000,
              originalPrice: 1200000,
              rating: 4.9,
              matchScore: 96,
              features: ["Beachfront venue", "Professional photography", "Live music", "Catering for 200"],
            },
          ],
        },
        insights: [
          "Based on your description, a beach wedding would be perfect for your style",
          "Consider booking 6 months in advance for better availability",
          "Your guest count suggests a medium-sized venue would be ideal",
        ],
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
      }

      recognition.start()
    }
  }

  const quickSearches = [
    "Beach wedding venues in Galle",
    "Garden wedding under 200k",
    "Luxury hotel ballrooms Colombo",
    "Mountain view venues for 150 guests",
    "Traditional wedding venues Kandy",
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(219, 39, 119, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0"
        />

        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 60%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered Wedding Search</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
              Wedding Experience
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Describe your dream wedding in natural language and let our AI find the perfect venues, vendors, and
            packages for you
          </p>
        </motion.div>

        {/* AI Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <CardContent className="p-8">
              {/* Natural Language Search */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Describe your dream wedding</span>
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="e.g., 'I want a beach wedding in Galle for 200 guests with traditional Sri Lankan cuisine and live music'"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-12 h-14 text-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute right-2 top-2 ${isListening ? "text-red-500" : "text-gray-400"}`}
                      onClick={handleVoiceSearch}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                {/* Quick Search Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Quick searches:</span>
                  {quickSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50"
                      onClick={() => setSearchQuery(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>

                {/* Traditional Search Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <LocationDropdown
                      value={selectedLocation}
                      onChange={setSelectedLocation}
                      placeholder="Select location"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Wedding Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Guest Count</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Number of guests"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <Button
                  onClick={handleAISearch}
                  disabled={isSearching}
                  className="w-full h-14 text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 hover:from-pink-600 hover:via-purple-600 hover:to-rose-600"
                >
                  {isSearching ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="mr-2"
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Search className="mr-2 h-5 w-5" />
                  )}
                  {isSearching ? "AI is searching..." : "Find My Perfect Wedding"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Search Results */}
        {aiResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <AISearchResults results={aiResults} />
          </motion.div>
        )}
      </div>
    </section>
  )
}
