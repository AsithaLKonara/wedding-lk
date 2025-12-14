import { Metadata } from 'next'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { Heart, Palette, Sparkles, Target, Users, Zap, Star, Gift } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Personalized Experience | WeddingLK',
  description: 'Get personalized wedding recommendations and experiences tailored to your unique style and preferences.',
}

const personalizationFeatures = [
  {
    icon: Heart,
    title: 'Style Matching',
    description: 'AI learns your style preferences to recommend vendors and venues that match your vision.',
    benefits: [
      'Personalized vendor recommendations',
      'Style-based venue suggestions',
      'Color palette matching',
      'Theme consistency'
    ]
  },
  {
    icon: Target,
    title: 'Budget Optimization',
    description: 'Smart budget allocation based on your priorities and preferences.',
    benefits: [
      'Priority-based spending',
      'Budget optimization suggestions',
      'Cost-saving recommendations',
      'Value analysis'
    ]
  },
  {
    icon: Users,
    title: 'Guest Experience',
    description: 'Personalized experiences for your guests based on their preferences.',
    benefits: [
      'Guest preference tracking',
      'Personalized invitations',
      'Dietary accommodation',
      'Activity recommendations'
    ]
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    description: 'Machine learning provides increasingly accurate recommendations over time.',
    benefits: [
      'Learning from your choices',
      'Improved accuracy over time',
      'Trend-based suggestions',
      'Seasonal recommendations'
    ]
  },
  {
    icon: Palette,
    title: 'Visual Preferences',
    description: 'Track and apply your visual preferences across all wedding elements.',
    benefits: [
      'Color scheme consistency',
      'Design style matching',
      'Visual mood boards',
      'Aesthetic coordination'
    ]
  },
  {
    icon: Gift,
    title: 'Gift Registry',
    description: 'Personalized gift registry based on your lifestyle and preferences.',
    benefits: [
      'Lifestyle-based suggestions',
      'Price range preferences',
      'Guest budget matching',
      'Registry analytics'
    ]
  }
]

const personalizationStats = [
  { number: '92%', label: 'Recommendation Accuracy' },
  { number: '85%', label: 'User Satisfaction' },
  { number: '40%', label: 'Time Saved' },
  { number: '95%', label: 'Style Match' }
]

const personalizationSteps = [
  {
    step: 1,
    title: 'Style Quiz',
    description: 'Complete our comprehensive style assessment to understand your preferences.',
    icon: Palette
  },
  {
    step: 2,
    title: 'AI Learning',
    description: 'Our AI analyzes your choices to build a personalized profile.',
    icon: Sparkles
  },
  {
    step: 3,
    title: 'Smart Recommendations',
    description: 'Receive tailored recommendations for vendors, venues, and services.',
    icon: Target
  },
  {
    step: 4,
    title: 'Continuous Improvement',
    description: 'The system learns and improves with every interaction.',
    icon: Zap
  }
]

export default function PersonalizationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Heart className="w-12 h-12 text-red-400" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                Personalized Experience
              </h1>
              <p className="text-xl md:text-2xl text-pink-100 mb-8 leading-relaxed">
                Every recommendation, every suggestion, every detail tailored specifically to your 
                unique style and vision for your perfect wedding day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Take Style Quiz
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                  View Examples
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Personalization Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Personalized Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced personalization technology that adapts to your unique preferences and style.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {personalizationFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white">
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
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personalization Stats Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Personalization Results
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how our personalization technology improves your wedding planning experience.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {personalizationStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-red-600 mb-2">
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

        {/* How Personalization Works Section */}
        <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How Personalization Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple steps to create your personalized wedding planning experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {personalizationSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Style Categories Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Wedding Style Categories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover your perfect wedding style with our comprehensive style categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl text-white">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">Romantic</h3>
                </div>
                <p className="text-gray-600 mb-4">Soft colors, delicate florals, and intimate settings.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">Blush Pink</span>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">Roses</span>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">Candles</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">Modern</h3>
                </div>
                <p className="text-gray-600 mb-4">Clean lines, minimalist design, and contemporary elegance.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">White</span>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">Geometric</span>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">Metallic</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">Rustic</h3>
                </div>
                <p className="text-gray-600 mb-4">Natural elements, warm colors, and countryside charm.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">Wood</span>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">Burnt Orange</span>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">Wildflowers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-red-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Your Personalized Journey
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
              Discover vendors, venues, and services perfectly matched to your unique style and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Take Style Quiz
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                Browse Styles
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
