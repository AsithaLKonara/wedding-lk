"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

import { Brain, Camera, MessageCircle, Sparkles, Wand2, Eye, Palette, Users, Star } from "lucide-react"

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Badge will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Tabs will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsList will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function AIEnhancementsPage() {
  const [selectedDemo, setSelectedDemo] = useState("style-matcher")

  const aiFeatures = [
    {
      id: "style-matcher",
      title: "AI Wedding Style Matcher",
      description: "Analyze preferences and suggest perfect wedding themes",
      icon: Palette,
      demo: {
        input: "I love vintage aesthetics, outdoor settings, and warm colors",
        output: {
          style: "Rustic Vintage",
          confidence: 94,
          suggestions: [
            "Barn venue with string lights",
            "Burlap and lace decorations",
            "Warm amber lighting",
            "Vintage wooden furniture",
          ],
        },
      },
    },
    {
      id: "budget-optimizer",
      title: "Smart Budget Optimizer",
      description: "AI-powered budget allocation recommendations",
      icon: Brain,
      demo: {
        input: "Total budget: LKR 1,500,000 for 200 guests",
        output: {
          allocations: [
            { category: "Venue", percentage: 40, amount: 600000 },
            { category: "Catering", percentage: 30, amount: 450000 },
            { category: "Photography", percentage: 15, amount: 225000 },
            { category: "Decorations", percentage: 10, amount: 150000 },
            { category: "Other", percentage: 5, amount: 75000 },
          ],
        },
      },
    },
    {
      id: "vendor-matcher",
      title: "Intelligent Vendor Matching",
      description: "ML-based vendor recommendations",
      icon: Users,
      demo: {
        input: "Beach wedding, 150 guests, photography style: candid",
        output: {
          matches: [
            { name: "Ocean View Photography", score: 96, specialty: "Beach weddings" },
            { name: "Coastal Catering Co.", score: 92, specialty: "Outdoor events" },
            { name: "Seaside Decorators", score: 89, specialty: "Beach themes" },
          ],
        },
      },
    },
    {
      id: "photo-generator",
      title: "AI Photo Style Generator",
      description: "Generate wedding mood boards from descriptions",
      icon: Camera,
      demo: {
        input: "Elegant garden wedding with soft pastels",
        output: {
          moodboard: "/placeholder.svg?height=300&width=400",
          elements: ["Soft pink roses", "Garden archway", "Flowing fabrics", "Natural lighting"],
        },
      },
    },
  ]

  const advancedFeatures = [
    {
      title: "Computer Vision for Venue Analysis",
      description: "Automatically analyze venue photos to extract features, capacity, and style",
      capabilities: [
        "Automatic venue categorization",
        "Capacity estimation from photos",
        "Style and theme detection",
        "Accessibility feature identification",
      ],
    },
    {
      title: "Natural Language Processing",
      description: "Understand complex wedding requirements in natural language",
      capabilities: [
        "Parse wedding descriptions",
        "Extract preferences and requirements",
        "Sentiment analysis of reviews",
        "Automated content generation",
      ],
    },
    {
      title: "Predictive Analytics",
      description: "Predict trends, pricing, and availability",
      capabilities: [
        "Seasonal pricing predictions",
        "Venue availability forecasting",
        "Wedding trend analysis",
        "Demand prediction modeling",
      ],
    },
    {
      title: "Personalization Engine",
      description: "Learn user preferences for hyper-personalized recommendations",
      capabilities: [
        "Behavioral pattern analysis",
        "Preference learning algorithms",
        "Dynamic content personalization",
        "Recommendation optimization",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Brain className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium text-gray-700 dark:text-gray-300">AI-Powered Features</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Intelligent Wedding
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Planning Assistant
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your platform with cutting-edge AI that understands weddings like a human expert
          </p>
        </motion.div>

        {/* AI Feature Demos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              {aiFeatures.map((feature) => (
                <TabsTrigger key={feature.id} value={feature.id} className="text-xs">
                  {feature.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {aiFeatures.map((feature) => {
              const IconComponent = feature.icon
              return (
                <TabsContent key={feature.id} value={feature.id}>
                  <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{feature.title}</CardTitle>
                          <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Demo */}
                        <div>
                          <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <Wand2 className="h-5 w-5 mr-2 text-blue-500" />
                            User Input
                          </h3>
                          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                            <CardContent className="p-4">
                              <p className="text-gray-700 dark:text-gray-300 italic">"{feature.demo.input}"</p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* AI Output */}
                        <div>
                          <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                            AI Analysis
                          </h3>
                          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                            <CardContent className="p-4">
                              {feature.id === "style-matcher" && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Recommended Style:</span>
                                    <Badge className="bg-purple-100 text-purple-800">{feature.demo.output.style}</Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Confidence:</span>
                                    <span className="text-green-600 font-bold">{feature.demo.output.confidence}%</span>
                                  </div>
                                  <div>
                                    <span className="font-medium block mb-2">Suggestions:</span>
                                    <ul className="space-y-1">
                                      {feature.demo.output?.suggestions?.map((suggestion, index) => (
                                        <li
                                          key={index}
                                          className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                                        >
                                          <Star className="h-3 w-3 mr-2 text-yellow-500" />
                                          {suggestion}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}

                              {feature.id === "budget-optimizer" && (
                                <div className="space-y-3">
                                  {feature.demo.output?.allocations?.map((allocation, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span className="font-medium">{allocation.category}:</span>
                                      <div className="text-right">
                                        <div className="font-bold">LKR {allocation.amount.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">{allocation.percentage}%</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {feature.id === "vendor-matcher" && (
                                <div className="space-y-3">
                                  {feature.demo.output?.matches?.map((match, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <div>
                                        <div className="font-medium">{match.name}</div>
                                        <div className="text-sm text-gray-500">{match.specialty}</div>
                                      </div>
                                      <Badge className="bg-green-100 text-green-800">{match.score}% match</Badge>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {feature.id === "photo-generator" && (
                                <div className="space-y-3">
                                  <img
                                    src={feature.demo.output.moodboard || "/placeholder.svg"}
                                    alt="Generated mood board"
                                    className="w-full rounded-lg"
                                  />
                                  <div>
                                    <span className="font-medium block mb-2">Generated Elements:</span>
                                    <div className="flex flex-wrap gap-2">
                                      {feature.demo.output?.elements?.map((element, index) => (
                                        <Badge key={index} variant="outline">
                                          {element}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            })}
          </Tabs>
        </motion.div>

        {/* Advanced AI Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Eye className="h-6 w-6 text-green-500 mr-3" />
                Advanced AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {advancedFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{feature.description}</p>
                        <div className="space-y-2">
                          {feature.capabilities.map((capability, capIndex) => (
                            <div key={capIndex} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{capability}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Implementation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Add AI Intelligence?</h2>
              <p className="text-lg mb-6 opacity-90">
                Transform your platform with AI that understands weddings like a human expert
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-blue-600">
                  <Brain className="mr-2 h-5 w-5" />
                  Start AI Integration
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Discuss AI Strategy
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
