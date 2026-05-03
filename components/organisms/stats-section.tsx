"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Users, MapPin, Star, Calendar, Award, Sparkles, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "10,000+",
    label: "Happy Couples",
    description: "Couples who found their perfect wedding through our platform",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: MapPin,
    number: "500+",
    label: "Venues",
    description: "Stunning venues across all 9 provinces of Sri Lanka",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Heart,
    number: "2,000+",
    label: "Vendors",
    description: "Trusted vendors from photographers to traditional dancers",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Calendar,
    number: "15,000+",
    label: "Events Planned",
    description: "Successful weddings and celebrations organized",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "Average Rating",
    description: "Customer satisfaction rating from our couples",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Award,
    number: "50+",
    label: "Awards Won",
    description: "Recognition for excellence in wedding services",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Sparkles,
    number: "25",
    label: "Districts Covered",
    description: "Complete coverage across Sri Lanka",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    number: "95%",
    label: "Success Rate",
    description: "Couples who successfully planned their dream wedding",
    color: "from-teal-500 to-green-500",
  },
]

export function StatsSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-pink-500/10 rounded-full px-6 py-3 mb-6 border border-pink-500/20">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">Our Impact</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Numbers That Tell <span className="gradient-text">Our Story</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From our humble beginnings to becoming Sri Lanka's most trusted wedding platform, these numbers reflect our commitment to excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative h-full bg-card/50 backdrop-blur-sm rounded-[2rem] p-8 border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-[2rem] transition-opacity duration-500`} />

                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  <div className={`text-4xl font-black mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>

                  <div className="text-xl font-bold mb-3">{stat.label}</div>

                  <div className="text-sm text-muted-foreground leading-relaxed">{stat.description}</div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] p-12 border border-border shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <h3 className="text-3xl md:text-4xl font-black mb-6">
              Ready to Be Part of Our <span className="gradient-text">Success Story?</span>
            </h3>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of happy couples and top-tier vendors on Sri Lanka&apos;s premier wedding platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => window.location.href = '/auth/signup'}
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-10 h-14 rounded-full font-bold shadow-xl shadow-rose-500/20 transition-all active:scale-95"
              >
                Start Planning Today
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/venues'}
                size="lg"
                className="border-2 h-14 px-10 rounded-full font-bold hover:bg-foreground hover:text-background transition-all"
              >
                Explore Venues
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


export default StatsSection
