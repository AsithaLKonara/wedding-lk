"use client"

import { motion } from "framer-motion"
import { FeatureCard } from "@/components/molecules/feature-card"
import { Calendar, MapPin, Users, Heart, Camera, Music } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Event Planning",
    description: "Comprehensive timeline and checklist management for your wedding day.",
  },
  {
    icon: MapPin,
    title: "Venue Discovery",
    description: "Find and book the perfect venue from our curated collection.",
  },
  {
    icon: Users,
    title: "Vendor Network",
    description: "Connect with trusted photographers, caterers, and decorators.",
  },
  {
    icon: Heart,
    title: "Guest Management",
    description: "Manage invitations, RSVPs, and seating arrangements effortlessly.",
  },
  {
    icon: Camera,
    title: "Photo Sharing",
    description: "Create shared albums for guests to upload and share memories.",
  },
  {
    icon: Music,
    title: "Entertainment",
    description: "Book DJs, bands, and entertainment for your special day.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-sm font-bold mb-6 tracking-wide uppercase">
            Platform Features
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            Everything You Need for Your <span className="gradient-text">Perfect Day</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our platform provides all the tools and services to plan your dream wedding with ease and elegance.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative p-8 rounded-3xl bg-card border border-border/50 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 h-full overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <feature.icon className="w-24 h-24 -mr-8 -mt-8" />
                </div>
                
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center mb-8 shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-rose-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


export default FeaturesSection
