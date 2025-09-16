import { Metadata } from 'next'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { Zap, Gauge, Clock, Database, Globe, Smartphone, Wifi, Battery } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Performance & Speed | WeddingLK',
  description: 'Experience lightning-fast wedding planning with WeddingLK\'s optimized performance and speed.',
}

const performanceFeatures = [
  {
    icon: Zap,
    title: 'Lightning Fast Loading',
    description: 'Pages load in under 2 seconds with our optimized infrastructure.',
    benefits: [
      'Sub-2 second page loads',
      'Optimized image delivery',
      'CDN global distribution',
      'Cached content delivery'
    ]
  },
  {
    icon: Database,
    title: 'Optimized Database',
    description: 'Advanced database optimization ensures quick data retrieval.',
    benefits: [
      'Indexed database queries',
      'Connection pooling',
      'Query optimization',
      'Real-time data sync'
    ]
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Content delivered from servers closest to your location.',
    benefits: [
      '200+ global edge locations',
      'Automatic failover',
      'DDoS protection',
      'SSL encryption'
    ]
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimization',
    description: 'Optimized for mobile devices with responsive design.',
    benefits: [
      'Mobile-first design',
      'Touch-optimized interface',
      'Offline functionality',
      'Progressive Web App'
    ]
  },
  {
    icon: Wifi,
    title: 'Offline Capability',
    description: 'Continue planning even without internet connection.',
    benefits: [
      'Offline data access',
      'Sync when online',
      'Cached content',
      'Background updates'
    ]
  },
  {
    icon: Battery,
    title: 'Battery Efficient',
    description: 'Optimized to preserve device battery life.',
    benefits: [
      'Efficient resource usage',
      'Background optimization',
      'Smart caching',
      'Minimal data usage'
    ]
  }
]

const performanceStats = [
  { number: '1.2s', label: 'Average Load Time' },
  { number: '99.9%', label: 'Uptime' },
  { number: '200+', label: 'Global Locations' },
  { number: '50ms', label: 'API Response' }
]

const optimizationTechniques = [
  {
    title: 'Image Optimization',
    description: 'Automatic image compression and format optimization',
    impact: '60% faster loading'
  },
  {
    title: 'Code Splitting',
    description: 'Load only the code needed for each page',
    impact: '40% smaller bundles'
  },
  {
    title: 'Caching Strategy',
    description: 'Intelligent caching reduces server load',
    impact: '80% faster repeat visits'
  },
  {
    title: 'Database Indexing',
    description: 'Optimized database queries for faster data access',
    impact: '90% faster queries'
  }
]

export default function PerformancePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Zap className="w-12 h-12 text-yellow-400" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Lightning Fast Performance
              </h1>
              <p className="text-xl md:text-2xl text-orange-100 mb-8 leading-relaxed">
                Experience wedding planning at the speed of light. Our optimized platform delivers 
                instant responses and seamless user experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Test Performance
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                  View Benchmarks
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Optimized for Speed
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every aspect of WeddingLK is optimized for maximum performance and user experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {performanceFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white">
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
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Stats Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Performance Metrics
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real performance data that speaks for itself.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {performanceStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-yellow-600 mb-2">
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

        {/* Optimization Techniques Section */}
        <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Optimization Techniques
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced optimization techniques ensure maximum performance across all devices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {optimizationTechniques.map((technique, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{technique.title}</h3>
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {technique.impact}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {technique.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Speed Comparison Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Speed Comparison
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how WeddingLK compares to other wedding planning platforms.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">WeddingLK</span>
                    <div className="flex items-center">
                      <div className="w-64 bg-gray-200 rounded-full h-4 mr-4">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full" style={{width: '95%'}}></div>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">1.2s</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Competitor A</span>
                    <div className="flex items-center">
                      <div className="w-64 bg-gray-200 rounded-full h-4 mr-4">
                        <div className="bg-gray-400 h-4 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-lg font-bold text-gray-600">3.8s</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Competitor B</span>
                    <div className="flex items-center">
                      <div className="w-64 bg-gray-200 rounded-full h-4 mr-4">
                        <div className="bg-gray-400 h-4 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <span className="text-lg font-bold text-gray-600">5.2s</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Competitor C</span>
                    <div className="flex items-center">
                      <div className="w-64 bg-gray-200 rounded-full h-4 mr-4">
                        <div className="bg-gray-400 h-4 rounded-full" style={{width: '35%'}}></div>
                      </div>
                      <span className="text-lg font-bold text-gray-600">7.1s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Experience Lightning Fast Planning
            </h2>
            <p className="text-xl text-yellow-100 mb-8 max-w-3xl mx-auto">
              Join thousands of couples who enjoy fast, responsive wedding planning with WeddingLK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Start Planning Now
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                Performance Test
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
