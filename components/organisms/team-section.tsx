"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Linkedin, Twitter, Mail, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const teamMembers = [
  {
    name: "Arjun Mendis",
    role: "Co-Founder & CEO",
    bio: "Former tech lead at Dialog Axiata with a passion for Sri Lankan culture and technology innovation.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "arjun@weddingplatform.lk",
    },
  },
  {
    name: "Kavitha Rajapaksa",
    role: "Co-Founder & COO",
    bio: "Wedding planner turned entrepreneur, bringing 8+ years of event management experience.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "kavitha@weddingplatform.lk",
    },
  },
  {
    name: "Dinesh Wickramasinghe",
    role: "Head of Technology",
    bio: "Full-stack developer passionate about creating seamless user experiences for couples.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "dinesh@weddingplatform.lk",
    },
  },
  {
    name: "Malini Perera",
    role: "Head of Vendor Relations",
    bio: "Building strong partnerships with vendors across all 9 provinces of Sri Lanka.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "malini@weddingplatform.lk",
    },
  },
  {
    name: "Chaminda Silva",
    role: "Cultural Specialist",
    bio: "Preserving and promoting traditional Sri Lankan wedding customs in the digital age.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "chaminda@weddingplatform.lk",
    },
  },
  {
    name: "Sanduni Fernando",
    role: "Customer Success Manager",
    bio: "Ensuring every couple has an amazing experience from planning to their special day.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "sanduni@weddingplatform.lk",
    },
  },
]

export function TeamSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-pink-200/50 dark:border-pink-800/50">
            <Heart className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Meet Our Team</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            The People Behind Your Perfect Day
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our diverse team combines technology expertise, cultural knowledge, and wedding industry experience to serve
            couples across Sri Lanka.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative w-24 h-24 mx-auto">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  </div>
                </div>

                {/* Member Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-pink-600 dark:text-pink-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-gray-600 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Want to Join Our Team?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We&apos;re passionate about making your wedding dreams come true.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Open Positions
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


export default TeamSection
