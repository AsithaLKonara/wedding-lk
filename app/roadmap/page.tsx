"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

import {
  Sparkles,
  Zap,
  Globe,
  Users,
  Camera,
  MessageCircle,
  Calendar,
  CreditCard,
  Shield,
  BarChart3,
  Brain,
  Heart,
  Trophy,
  Rocket,
  Target,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

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

export default function RoadmapPage() {
  const [selectedPhase, setSelectedPhase] = useState("immediate")

  const roadmapPhases = {
    immediate: {
      title: "Phase 1: Immediate Enhancements (1-2 months)",
      description: "Quick wins to boost user engagement and platform value",
      priority: "high",
      features: [
        {
          category: "AI & Personalization",
          icon: Brain,
          items: [
            "AI Wedding Style Matcher - Analyze user preferences and suggest perfect themes",
            "Smart Budget Optimizer - AI-powered budget allocation recommendations",
            "Personalized Vendor Recommendations - ML-based vendor matching",
            "AI Photo Style Generator - Generate wedding mood boards from descriptions",
          ],
        },
        {
          category: "Enhanced User Experience",
          icon: Heart,
          items: [
            "Interactive 3D Venue Tours - Virtual reality venue exploration",
            "Real-time Chat System - Instant messaging with vendors",
            "Advanced Calendar Integration - Google/Outlook calendar sync",
            "Mobile App (React Native) - Native iOS/Android experience",
          ],
        },
        {
          category: "Social Features",
          icon: Users,
          items: [
            "Wedding Stories & Reviews - User-generated content platform",
            "Couple's Wedding Website Builder - Drag-and-drop website creation",
            "Guest RSVP Management - Advanced guest tracking system",
            "Social Media Integration - Auto-post to Instagram/Facebook",
          ],
        },
      ],
    },
    growth: {
      title: "Phase 2: Growth & Expansion (3-6 months)",
      description: "Scale the platform and add advanced business features",
      priority: "medium",
      features: [
        {
          category: "Advanced Business Tools",
          icon: BarChart3,
          items: [
            "Vendor CRM System - Complete customer relationship management",
            "Advanced Analytics Dashboard - Business intelligence for vendors",
            "Multi-vendor Marketplace - Complex vendor ecosystem",
            "Subscription Management - Tiered vendor subscriptions",
          ],
        },
        {
          category: "Payment & Financial",
          icon: CreditCard,
          items: [
            "Escrow Payment System - Secure payment holding",
            "Installment Payment Plans - Flexible payment options",
            "Multi-currency Support - International expansion ready",
            "Automated Invoicing - Smart billing system",
          ],
        },
        {
          category: "Content & Media",
          icon: Camera,
          items: [
            "Professional Photo/Video Galleries - High-quality media management",
            "Live Streaming Integration - Stream ceremonies online",
            "Drone Photography Booking - Aerial photography services",
            "AI Photo Enhancement - Automatic photo improvement",
          ],
        },
      ],
    },
    advanced: {
      title: "Phase 3: Advanced Features (6-12 months)",
      description: "Cutting-edge technology and market leadership",
      priority: "future",
      features: [
        {
          category: "Emerging Technology",
          icon: Rocket,
          items: [
            "AR/VR Wedding Planning - Augmented reality venue decoration",
            "Blockchain Certificates - Immutable wedding certificates",
            "IoT Integration - Smart venue management",
            "Voice Assistant Integration - Alexa/Google Assistant support",
          ],
        },
        {
          category: "Global Expansion",
          icon: Globe,
          items: [
            "Multi-language Support - 10+ languages",
            "Cultural Wedding Traditions - Global wedding customs",
            "International Vendor Network - Worldwide vendor partnerships",
            "Cross-border Payment Solutions - Global payment processing",
          ],
        },
        {
          category: "Enterprise Features",
          icon: Shield,
          items: [
            "White-label Solutions - Platform licensing",
            "API Marketplace - Third-party integrations",
            "Advanced Security - Enterprise-grade security",
            "Compliance Management - GDPR, PCI DSS compliance",
          ],
        },
      ],
    },
  }

  const quickWins = [
    {
      title: "AI-Powered Search Enhancement",
      description: "Upgrade search with natural language processing and image recognition",
      impact: "High",
      effort: "Medium",
      timeline: "2 weeks",
      icon: Brain,
    },
    {
      title: "Real-time Notifications",
      description: "Push notifications for bookings, messages, and updates",
      impact: "High",
      effort: "Low",
      timeline: "1 week",
      icon: MessageCircle,
    },
    {
      title: "Advanced Filtering System",
      description: "Multi-dimensional filters with saved searches",
      impact: "Medium",
      effort: "Low",
      timeline: "1 week",
      icon: Target,
    },
    {
      title: "Vendor Portfolio Builder",
      description: "Drag-and-drop portfolio creation for vendors",
      impact: "High",
      effort: "Medium",
      timeline: "3 weeks",
      icon: Camera,
    },
  ]

  const marketOpportunities = [
    {
      title: "Wedding Insurance Integration",
      description: "Partner with insurance companies for wedding protection",
      revenue: "Commission-based",
      market: "₹50M+ annually in Sri Lanka",
    },
    {
      title: "Honeymoon Planning",
      description: "Expand to honeymoon destination and travel booking",
      revenue: "Booking fees + partnerships",
      market: "₹100M+ travel market",
    },
    {
      title: "Wedding Financing",
      description: "Offer wedding loans and payment plans",
      revenue: "Interest + fees",
      market: "₹200M+ lending opportunity",
    },
    {
      title: "Corporate Events",
      description: "Expand platform for corporate event planning",
      revenue: "Premium subscriptions",
      market: "₹300M+ corporate events",
    },
  ]

  const technicalImprovements = [
    {
      category: "Performance",
      items: [
        "Implement Redis caching for 50% faster load times",
        "Add CDN for global image delivery",
        "Optimize database queries with indexing",
        "Implement lazy loading for better UX",
      ],
    },
    {
      category: "Security",
      items: [
        "Add two-factor authentication",
        "Implement rate limiting",
        "Add data encryption at rest",
        "Security audit and penetration testing",
      ],
    },
    {
      category: "Scalability",
      items: [
        "Microservices architecture migration",
        "Kubernetes deployment",
        "Auto-scaling infrastructure",
        "Load balancing implementation",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Platform Enhancement Roadmap</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Transform Your
            <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              Wedding Platform
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive roadmap to build the most advanced wedding platform in South Asia
          </p>
        </motion.div>

        {/* Quick Wins Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Zap className="h-6 w-6 text-yellow-500 mr-3" />
                Quick Wins (Implement This Week)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickWins.map((win, index) => {
                  const IconComponent = win.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="h-full border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                              <IconComponent className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{win.title}</h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{win.description}</p>
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline">Impact: {win.impact}</Badge>
                                <Badge variant="outline">Effort: {win.effort}</Badge>
                                <Badge className="bg-green-100 text-green-800">{win.timeline}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Roadmap Phases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Tabs value={selectedPhase} onValueChange={setSelectedPhase} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="immediate" className="text-sm">
                Phase 1: Immediate
              </TabsTrigger>
              <TabsTrigger value="growth" className="text-sm">
                Phase 2: Growth
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-sm">
                Phase 3: Advanced
              </TabsTrigger>
            </TabsList>

            {Object.entries(roadmapPhases).map(([phase, data]) => (
              <TabsContent key={phase} value={phase}>
                <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{data.title}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-400">{data.description}</p>
                      </div>
                      <Badge
                        className={
                          data.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : data.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {data.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {data.features.map((category, categoryIndex) => {
                        const IconComponent = category.icon
                        return (
                          <motion.div
                            key={categoryIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                          >
                            <div className="border rounded-lg p-6">
                              <div className="flex items-center mb-4">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                                  <IconComponent className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold">{category.category}</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {category.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Market Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Trophy className="h-6 w-6 text-gold-500 mr-3" />
                Revenue Expansion Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{opportunity.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{opportunity.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Revenue Model:</span>
                            <span className="font-medium">{opportunity.revenue}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Market Size:</span>
                            <span className="font-medium text-green-600">{opportunity.market}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technical Improvements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Rocket className="h-6 w-6 text-blue-500 mr-3" />
                Technical Infrastructure Upgrades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {technicalImprovements.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
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
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-12 text-center"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Platform?</h2>
              <p className="text-lg mb-6 opacity-90">
                Start with Phase 1 quick wins and build the most advanced wedding platform in South Asia
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-purple-600">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Implementation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Planning Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
