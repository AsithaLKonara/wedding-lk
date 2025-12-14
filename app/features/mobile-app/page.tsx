import { Metadata } from 'next'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { Smartphone, Download, Wifi, Camera, MapPin, Bell, Users, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mobile App | WeddingLK',
  description: 'Download the WeddingLK mobile app for seamless wedding planning on the go. Available for iOS and Android.',
}

const features = [
  {
    icon: Camera,
    title: 'Photo & Video Sharing',
    description: 'Capture and share moments instantly with your wedding party and vendors.',
    benefits: [
      'High-quality photo capture',
      'Video recording and sharing',
      'Real-time photo sharing',
      'Cloud storage integration'
    ]
  },
  {
    icon: MapPin,
    title: 'Location Services',
    description: 'Find nearby vendors and venues with GPS-powered location services.',
    benefits: [
      'Nearby vendor discovery',
      'Venue location tracking',
      'GPS navigation to venues',
      'Location-based recommendations'
    ]
  },
  {
    icon: Bell,
    title: 'Push Notifications',
    description: 'Stay updated with real-time notifications about bookings, messages, and updates.',
    benefits: [
      'Instant booking confirmations',
      'Message notifications',
      'Reminder alerts',
      'Vendor updates'
    ]
  },
  {
    icon: Users,
    title: 'Social Features',
    description: 'Connect with other couples, share experiences, and get inspiration.',
    benefits: [
      'Couple networking',
      'Experience sharing',
      'Community forums',
      'Inspiration feeds'
    ]
  },
  {
    icon: CreditCard,
    title: 'Mobile Payments',
    description: 'Secure mobile payments with integrated payment processing.',
    benefits: [
      'Secure payment processing',
      'Multiple payment methods',
      'Payment history tracking',
      'Receipt management'
    ]
  },
  {
    icon: Wifi,
    title: 'Offline Access',
    description: 'Access your wedding plans even without internet connection.',
    benefits: [
      'Offline data access',
      'Sync when online',
      'Cached content',
      'Emergency access'
    ]
  }
]

const appStats = [
  { number: '50K+', label: 'Downloads' },
  { number: '4.8', label: 'App Store Rating' },
  { number: '99.9%', label: 'Uptime' },
  { number: '24/7', label: 'Support' }
]

export default function MobileAppPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm mr-4">
                    <Smartphone className="w-12 h-12 text-blue-400" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    WeddingLK Mobile App
                  </h1>
                </div>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Plan your perfect wedding anywhere, anytime with our feature-rich mobile application. 
                  Available for iOS and Android devices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                    <Download className="w-5 h-5 mr-2" />
                    Download for iOS
                  </button>
                  <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center">
                    <Download className="w-5 h-5 mr-2" />
                    Download for Android
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-80 h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-sm border border-white/20 p-8">
                    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                      <Smartphone className="w-32 h-32 text-white/50" />
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Powerful Mobile Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need for wedding planning, right in your pocket. Our mobile app brings the full power of WeddingLK to your smartphone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
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
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Stats Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join the growing community of couples who trust WeddingLK for their mobile wedding planning needs.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {appStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">
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

        {/* Screenshots Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                See It In Action
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Take a look at our beautiful, intuitive interface designed specifically for mobile wedding planning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-64 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <Smartphone className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-600">Dashboard View</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard</h3>
                <p className="text-gray-600">Overview of your wedding planning progress</p>
              </div>

              <div className="text-center">
                <div className="w-64 h-96 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Vendor Discovery</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Vendor Search</h3>
                <p className="text-gray-600">Find and connect with local vendors</p>
              </div>

              <div className="text-center">
                <div className="w-64 h-96 bg-gradient-to-br from-green-500/20 to-yellow-500/20 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">Social Feed</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Social Features</h3>
                <p className="text-gray-600">Connect with other couples and share experiences</p>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Download WeddingLK Today
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Available on both iOS and Android. Start planning your perfect wedding right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                App Store
              </button>
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Google Play
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}