"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function CTASection(props: any) {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 to-purple-600 px-8 py-16 text-center shadow-2xl sm:px-16"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <Sparkles className="mx-auto h-12 w-12 text-white/80 mb-6" />
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Start Planning?</h2>
            <p className="mt-4 text-lg text-white/90">
              Join thousands of couples who have planned their perfect wedding with us
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="group">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
