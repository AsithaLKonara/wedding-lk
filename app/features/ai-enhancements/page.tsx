import { Metadata } from 'next'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { Sparkles, Brain, Zap, Target, Users, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI-Powered Wedding Planning | WeddingLK',
  description: 'Discover how our advanced AI technology revolutionizes wedding planning with intelligent recommendations, automated assistance, and personalized experiences.',
}

const features = [
  {
    icon: Brain,
    title: 'Intelligent Vendor Matching',
    description: 'Our AI analyzes your preferences, budget, and style to recommend the perfect vendors for your wedding.',
    benefits: [
      'Personalized vendor recommendations',
      'Budget-optimized suggestions',
      'Style compatibility matching',
      'Real-time availability checking'
    ]
  },
  {
    icon: Target,
    title: 'Smart Budget Optimization',
    description: 'AI-powered budget analysis helps you allocate funds efficiently across all wedding categories.',
    benefits: [
      'Automatic budget allocation',
      'Cost-saving recommendations',
      'Price trend analysis',
      'Budget tracking and alerts'
    ]
  },
  {
    icon: Users,
    title: 'Guest Experience Enhancement',
    description: 'AI-driven guest management ensures every attendee has an unforgettable experience.',
    benefits: [
      'Intelligent seating arrangements',
      'Dietary preference management',
      'Transportation optimization',
      'Personalized welcome messages'
    ]
  },
  {
    icon: Zap,
    title: 'Automated Timeline Management',
    description: 'AI creates and manages your wedding timeline, ensuring everything runs smoothly.',
    benefits: [
      'Dynamic timeline generation',
      'Vendor coordination',
      'Real-time schedule updates',
      'Conflict resolution'
    ]
  },
  {
    icon: Shield,
    title: 'Risk Assessment & Mitigation',
    description: 'AI identifies potential issues and provides proactive solutions for a stress-free wedding.',
    benefits: [
      'Weather contingency planning',
      'Vendor backup recommendations',
      'Timeline risk analysis',
      'Emergency response protocols'
    ]
  }
]

const stats = [
  { number: '95%', label: 'Planning Accuracy' },
  { number: '40%', label: 'Time Saved' },
  { number: '85%', label: 'Budget Optimization' },
  { number: '98%', label: 'Guest Satisfaction' }
]

export default function AIEnhancementsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-12 h-12 text-yellow-400" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                AI-Powered Wedding Planning
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Experience the future of wedding planning with our advanced artificial intelligence technology that makes your dream wedding a reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Try AI Planning
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Revolutionary AI Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI technology transforms every aspect of wedding planning, from vendor selection to guest management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 ml-4">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Proven Results
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI technology delivers measurable improvements in wedding planning efficiency and satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-purple-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How Our AI Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI learns from thousands of successful weddings to provide you with the most accurate recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Data Collection</h3>
                <p className="text-gray-600">
                  We analyze your preferences, budget, style, and requirements to understand your vision.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI Analysis</h3>
                <p className="text-gray-600">
                  Our AI processes your data against our database of successful weddings and vendor performance.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Recommendations</h3>
                <p className="text-gray-600">
                  Receive personalized recommendations for vendors, timelines, and budget allocation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience AI-Powered Planning?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Join thousands of couples who have already discovered the power of AI-assisted wedding planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Start Planning Now
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}