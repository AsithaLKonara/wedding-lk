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

export default function AISearchSection(props: any) {
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
          <div className="inline-flex items-center bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-border/50">
            <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-sm font-bold text-muted-foreground tracking-wide uppercase">AI-Powered Wedding Search</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-foreground mb-8 tracking-tighter">
            Find Your Perfect
            <span className="block gradient-text pb-2">
              Wedding Experience
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            Describe your dream wedding in natural language and let our AI find the perfect venues, vendors, and packages for you
          </p>
        </motion.div>

        {/* AI Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border border-border/50 shadow-2xl bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10">
              {/* Natural Language Search */}
              <div className="space-y-10">
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Describe your dream wedding</span>
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="e.g., 'I want a beach wedding in Galle for 200 guests with traditional Sri Lankan cuisine and live music'"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-14 h-16 text-lg rounded-2xl bg-muted/50 border-border/50 focus-visible:ring-purple-500/20"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute right-3 top-3 h-10 w-10 rounded-xl ${isListening ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:bg-muted"}`}
                      onClick={handleVoiceSearch}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                {/* Quick Search Tags */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Quick searches:</span>
                  {quickSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer bg-muted/50 hover:bg-purple-500 hover:text-white transition-all duration-300 rounded-full px-4 py-1.5 border-none font-medium text-xs"
                      onClick={() => setSearchQuery(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>

                {/* Traditional Search Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Location</label>
                    <LocationDropdown
                      value={selectedLocation}
                      onChange={setSelectedLocation}
                      placeholder="Select location"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Wedding Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-12 h-12 rounded-xl bg-muted/50 border-border/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Guest Count</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Number of guests"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="pl-12 h-12 rounded-xl bg-muted/50 border-border/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <Button
                  onClick={handleAISearch}
                  disabled={isSearching}
                  className="w-full h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 hover:opacity-90 shadow-xl shadow-rose-500/20 transition-all active:scale-[0.98]"
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
