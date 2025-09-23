"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Award, Zap } from "lucide-react"

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState("premium")
  const [billingCycle, setBillingCycle] = useState("monthly")

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      nameLocal: "මූලික සැලැස්ම",
      icon: Award,
      price: { monthly: 12000, annual: 120000 },
      originalPrice: { monthly: 15000, annual: 150000 },
      popular: false,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Profile listing",
        "10 photos upload",
        "Basic contact leads",
        "WhatsApp integration",
        "Monthly analytics",
        "Standard support",
        "Mobile app access",
        "Basic search visibility",
      ],
      limits: {
        photos: 10,
        leads: 20,
        analytics: "Basic",
      },
    },
    {
      id: "premium",
      name: "Premium Plan",
      nameLocal: "ප්‍රිමියම් සැලැස්ම",
      icon: Star,
      price: { monthly: 25000, annual: 250000 },
      originalPrice: { monthly: 30000, annual: 300000 },
      popular: true,
      color: "from-purple-500 to-pink-500",
      features: [
        "Featured in search results",
        "Unlimited photos & videos",
        "Social media posting tools",
        "Customer review management",
        "Priority customer support",
        "Advanced analytics",
        "Lead management dashboard",
        "WhatsApp Business integration",
        "Multiple location listings",
        "Custom profile themes",
      ],
      limits: {
        photos: "Unlimited",
        leads: 100,
        analytics: "Advanced",
      },
    },
    {
      id: "elite",
      name: "Elite Plan",
      nameLocal: "ප්‍රභූ සැලැස්ම",
      icon: Crown,
      price: { monthly: 45000, annual: 450000 },
      originalPrice: { monthly: 55000, annual: 550000 },
      popular: false,
      color: "from-yellow-500 to-orange-500",
      features: [
        "Top search placement",
        "AI recommendation priority",
        "Custom profile design",
        "Dedicated account manager",
        "24/7 priority support",
        "Advanced lead management",
        "Social media automation",
        "Custom branding options",
        "API access",
        "White-label solutions",
        "Exclusive vendor events",
        "Premium badge display",
      ],
      limits: {
        photos: "Unlimited",
        leads: "Unlimited",
        analytics: "Premium + AI Insights",
      },
    },
  ]

  const handleSubscribe = async (plan: any) => {
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "subscription",
          plan: {
            id: plan.id,
            name: plan.name,
            price: plan.price[billingCycle as keyof typeof plan.price],
          },
          billingCycle,
          paymentMethod: "card", // Will be selected by user
        }),
      })

      const result = await response.json()
      if (result.success) {
        // Redirect to payment gateway or show success
        console.log("Subscription created:", result.data)
      }
    } catch (error) {
      console.error("Subscription error:", error)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Vendor Subscription Plans
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Choose the perfect plan to grow your wedding business in Sri Lanka
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
              className="rounded-full"
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "annual" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("annual")}
              className="rounded-full"
            >
              Annual
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Save 17%
              </Badge>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            const price = plan.price[billingCycle as keyof typeof plan.price]
            const originalPrice = plan.originalPrice[billingCycle as keyof typeof plan.originalPrice]
            const savings = originalPrice - price

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

                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{plan.nameLocal}</p>

                    <div className="space-y-2 mt-4">
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          LKR {price.toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-500 line-through">LKR {originalPrice.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        per {billingCycle === "monthly" ? "month" : "year"}
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        Save LKR {savings.toLocaleString()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limits */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Plan Limits:</h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <div>Photos: {plan.limits.photos}</div>
                        <div>Monthly Leads: {plan.limits.leads}</div>
                        <div>Analytics: {plan.limits.analytics}</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.popular ? (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Start Premium
                        </>
                      ) : (
                        `Choose ${plan.name}`
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      No setup fees • Cancel anytime • 14-day free trial
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accepted Payment Methods</h3>
          <div className="flex justify-center items-center space-x-6 flex-wrap">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
              <span className="text-sm font-medium">Dialog eZ Cash</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
              <span className="text-sm font-medium">Mobitel mCash</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
              <span className="text-sm font-medium">Credit/Debit Cards</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
              <span className="text-sm font-medium">Bank Transfer</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
