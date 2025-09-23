"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Smartphone, Download, Camera, Calendar, Users, Heart, Star, Zap, Shield } from "lucide-react"

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function MobileAppPage() {
  const appFeatures = [
    {
      category: "Core Features",
      icon: Smartphone,
      features: [
        "Native iOS & Android apps",
        "Offline venue browsing",
        "Push notifications",
        "Biometric authentication",
        "Dark mode support",
        "Multi-language interface",
      ],
    },
    {
      category: "Wedding Planning",
      icon: Calendar,
      features: [
        "Interactive wedding timeline",
        "Task management with reminders",
        "Budget tracking on-the-go",
        "Guest list management",
        "Vendor communication hub",
        "Real-time booking updates",
      ],
    },
    {
      category: "Social & Sharing",
      icon: Users,
      features: [
        "Wedding story sharing",
        "Photo & video galleries",
        "Social media integration",
        "Guest RSVP management",
        "Live wedding updates",
        "Family collaboration tools",
      ],
    },
    {
      category: "Advanced Features",
      icon: Zap,
      features: [
        "AR venue visualization",
        "Voice search & commands",
        "GPS venue navigation",
        "QR code vendor scanning",
        "Offline map downloads",
        "Smart recommendations",
      ],
    },
  ]

  const mobileStats = [
    { label: "Mobile Users", value: "78%", description: "of wedding planning happens on mobile" },
    { label: "App Engagement", value: "3.2x", description: "higher than mobile web" },
    { label: "Push Open Rate", value: "25%", description: "average for wedding apps" },
    { label: "Daily Sessions", value: "4.7", description: "average per active user" },
  ]

  const technicalSpecs = [
    {
      title: "React Native Framework",
      description: "Cross-platform development with native performance",
      benefits: ["Single codebase", "Native UI components", "Hot reloading", "Easy maintenance"],
    },
    {
      title: "Offline-First Architecture",
      description: "Works seamlessly without internet connection",
      benefits: ["Cached venue data", "Offline photo viewing", "Sync when online", "Better UX"],
    },
    {
      title: "Push Notification System",
      description: "Real-time updates and engagement",
      benefits: ["Booking confirmations", "Vendor messages", "Task reminders", "Price alerts"],
    },
    {
      title: "Advanced Security",
      description: "Enterprise-grade security features",
      benefits: ["Biometric auth", "Data encryption", "Secure payments", "Privacy controls"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-green-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Smartphone className="h-5 w-5 text-green-500 mr-2" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Mobile App Development</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Native Mobile
            <span className="block bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Wedding App
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Bring your wedding platform to iOS and Android with a native app experience
          </p>
        </motion.div>

        {/* Mobile Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mobileStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="text-center border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-green-600 mb-1">{stat.value}</div>
                    <div className="font-medium text-gray-900 dark:text-white mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* App Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Download className="h-6 w-6 text-blue-500 mr-3" />
                Mobile App Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {appFeatures.map((category, index) => {
                  const IconComponent = category.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="h-full border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                              <IconComponent className="h-5 w-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-lg">{category.category}</h3>
                          </div>
                          <div className="space-y-2">
                            {category.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                              </div>
                            ))}
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

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Shield className="h-6 w-6 text-purple-500 mr-3" />
                Technical Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {technicalSpecs.map((spec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3">{spec.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{spec.description}</p>
                        <div className="space-y-2">
                          {spec.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center gap-2">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
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

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Camera className="h-6 w-6 text-pink-500 mr-3" />
                App Screenshots Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-4">
                    <Smartphone className="h-24 w-24 mx-auto text-pink-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Home & Search</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI-powered search with beautiful venue cards
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-8 mb-4">
                    <Calendar className="h-24 w-24 mx-auto text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Planning Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Timeline, budget, and task management</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-100 to-yellow-100 dark:from-green-900/20 dark:to-yellow-900/20 rounded-2xl p-8 mb-4">
                    <Heart className="h-24 w-24 mx-auto text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Social Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share moments and collaborate with family</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Development CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Go Mobile?</h2>
              <p className="text-lg mb-6 opacity-90">Reach 78% more users with a native mobile app experience</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-green-600">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Start App Development
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  <Download className="mr-2 h-5 w-5" />
                  View Development Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
