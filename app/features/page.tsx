import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Smartphone, Shield, Zap, Users, Calendar, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features - WeddingLK',
  description: 'Discover the powerful features that make WeddingLK the ultimate wedding planning platform.',
}

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Planning',
    description: 'Intelligent recommendations and automated planning assistance',
    href: '/features/ai-enhancements',
    color: 'text-purple-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Full-featured mobile application for on-the-go planning',
    href: '/features/mobile-app',
    color: 'text-blue-600'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security for your sensitive wedding data',
    href: '/features/security',
    color: 'text-green-600'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance for seamless user experience',
    href: '/features/performance',
    color: 'text-yellow-600'
  },
  {
    icon: Users,
    title: 'Collaborative Planning',
    description: 'Work together with family and vendors seamlessly',
    href: '/features/collaboration',
    color: 'text-pink-600'
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Intelligent timeline management and reminders',
    href: '/features/scheduling',
    color: 'text-indigo-600'
  },
  {
    icon: Heart,
    title: 'Personalized Experience',
    description: 'Tailored recommendations based on your preferences',
    href: '/features/personalization',
    color: 'text-red-600'
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
              {' '}Perfect Weddings
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the comprehensive suite of tools and features that make WeddingLK the ultimate wedding planning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700">
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From initial planning to the big day, WeddingLK provides all the tools you need for a seamless wedding experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={feature.href || '#'}>
                    <Button variant="ghost" className="w-full group-hover:bg-gray-50">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Wedding Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of couples who have successfully planned their dream weddings with WeddingLK.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-rose-600 hover:bg-gray-100">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-rose-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 