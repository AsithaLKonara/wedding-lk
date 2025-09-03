"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Heart, Star, Zap, Users, Phone } from "lucide-react"

export function PremiumCoupleFeatures() {
  const [selectedPlan, setSelectedPlan] = useState("premium")

  const plans = [
    {
      id: "basic",
      name: "Wedding.lk Basic",
      nameLocal: "මූලික සැලැස්ම",
      price: 0,
      icon: Heart,
      color: "from-gray-500 to-gray-600",
      features: [
        "Basic venue search",
        "3 vendor contacts per month",
        "Standard customer support",
        "Basic wedding checklist",
        "Email notifications",
      ],
      limits: {
        venues: 10,
        vendors: 3,
        support: "Email only",
      },
    },
    {
      id: "premium",
      name: "Wedding.lk Premium",
      nameLocal: "ප්‍රිමියම් සැලැස්ම",
      price: 4500,
      icon: Star,
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "Unlimited venue & vendor contacts",
        "AI-powered wedding matching",
        "Priority customer support",
        "Advanced planning tools",
        "Budget tracker & timeline",
        "Guest management system",
        "WhatsApp support",
        "Exclusive deals & discounts",
        "Wedding coordinator consultation",
      ],
      limits: {
        venues: "Unlimited",
        vendors: "Unlimited",
        support: "Priority WhatsApp + Phone",
      },
    },
    {
      id: "pro",
      name: "Wedding.lk Pro",
      nameLocal: "ප්‍රෝ සැලැස්ම",
      price: 7500,
      icon: Crown,
      color: "from-yellow-500 to-orange-500",
      features: [
        "Everything in Premium",
        "Personal wedding consultant",
        "Traditional ceremony planning",
        "Astrology consultation included",
        "Family coordination tools",
        "Multi-language support",
        "24/7 priority support",
        "Exclusive venue access",
        "Custom wedding website",
        "Professional photography consultation",
      ],
      limits: {
        venues: "Unlimited + Exclusive",
        vendors: "Unlimited + VIP",
        support: "24/7 Personal Consultant",
      },
    },
  ]

  const premiumFeatures = [
    {
      title: "AI Wedding Matching",
      description: "Get personalized venue and vendor recommendations based on your preferences",
      icon: Zap,
      available: ["premium", "pro"],
    },
    {
      title: "Traditional Planning Tools",
      description: "Astrology matching, Poruwa ceremony planning, and cultural guidance",
      icon: Star,
      available: ["pro"],
    },
    {
      title: "Personal Wedding Consultant",
      description: "Dedicated consultant to help plan your perfect Sri Lankan wedding",
      icon: Users,
      available: ["pro"],
    },
    {
      title: "Priority Support",
      description: "WhatsApp and phone support with faster response times",
      icon: Phone,
      available: ["premium", "pro"],
    },
  ]

  const handleUpgrade = async (plan: any) => {
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "premium",
          plan: {
            id: plan.id,
            name: plan.name,
            price: plan.price,
          },
          duration: 1, // months
        }),
      })

      const result = await response.json()
      if (result.success) {
        console.log("Premium upgrade successful:", result.data)
      }
    } catch (error) {
      console.error("Upgrade error:", error)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Wedding Planning
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Unlock advanced features for your perfect Sri Lankan wedding
          </p>
        </motion.div>

        {/* Plan Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${plan.popular ? "scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card
                  className={`h-full border-2 ${
                    plan.popular ? "border-purple-500 shadow-2xl" : "border-gray-200 dark:border-gray-700"
                  } bg-white dark:bg-gray-800`}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>

                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{plan.nameLocal}</p>

                    <div className="mt-4">
                      {plan.price === 0 ? (
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">Free</span>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            LKR {plan.price.toLocaleString()}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-300">per month</p>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limits */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Plan Limits:</h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <div>Venues: {plan.limits.venues}</div>
                        <div>Vendors: {plan.limits.vendors}</div>
                        <div>Support: {plan.limits.support}</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleUpgrade(plan)}
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          : ""
                      }`}
                      variant={plan.id === "basic" ? "outline" : plan.popular ? "default" : "outline"}
                      disabled={plan.id === "basic"}
                    >
                      {plan.id === "basic" ? "Current Plan" : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Premium Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {premiumFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">{feature.description}</p>
                        <div className="flex space-x-2">
                          {feature.available.map((plan) => (
                            <Badge key={plan} variant="secondary" className="text-xs">
                              {plan.charAt(0).toUpperCase() + plan.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Secure Payment Methods / ආරක්ෂිත ගෙවීම් ක්‍රම
          </h3>
          <div className="flex justify-center items-center space-x-6 flex-wrap">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
              <span className="text-sm font-medium">Dialog eZ Cash</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
              <span className="text-sm font-medium">Mobitel mCash</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
              <span className="text-sm font-medium">Visa/Mastercard</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
              <span className="text-sm font-medium">Bank Transfer</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            All payments are secure and encrypted • Cancel anytime • 7-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  )
}


export default PremiumCoupleFeatures
