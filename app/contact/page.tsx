"use client"
import React from "react"
import { MainLayout } from "@/components/templates/main-layout"
import { ContactForm } from "@/components/organisms/contact-form"
import { ContactInfo } from "@/components/organisms/contact-info"
import { motion } from "framer-motion"

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We&apos;re here to help you plan your perfect wedding day.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
