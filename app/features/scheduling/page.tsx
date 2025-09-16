import { Metadata } from 'next'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { Calendar, Clock, Bell, CheckCircle, Users, MapPin, Zap, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Smart Scheduling | WeddingLK',
  description: 'Intelligent timeline management and smart scheduling for your perfect wedding day.',
}

const schedulingFeatures = [
  {
    icon: Calendar,
    title: 'Smart Timeline',
    description: 'AI-powered timeline creation that adapts to your wedding style and preferences.',
    benefits: [
      'Automated timeline generation',
      'Vendor coordination',
      'Buffer time management',
      'Conflict resolution'
    ]
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'Stay synchronized with live updates and automatic schedule adjustments.',
    benefits: [
      'Live schedule updates',
      'Automatic notifications',
      'Vendor synchronization',
      'Emergency adjustments'
    ]
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Intelligent reminders ensure nothing is forgotten on your special day.',
    benefits: [
      'Customizable alerts',
      'Milestone reminders',
      'Vendor check-ins',
      'Guest notifications'
    ]
  },
  {
    icon: CheckCircle,
    title: 'Task Management',
    description: 'Organize and track all wedding tasks with intelligent task management.',
    benefits: [
      'Task prioritization',
      'Progress tracking',
      'Deadline management',
      'Team assignments'
    ]
  },
  {
    icon: Users,
    title: 'Vendor Coordination',
    description: 'Seamlessly coordinate with all your vendors and service providers.',
    benefits: [
      'Vendor availability sync',
      'Shared calendars',
      'Communication hub',
      'Payment scheduling'
    ]
  },
  {
    icon: MapPin,
    title: 'Location Management',
    description: 'Manage multiple venues and locations with precision timing.',
    benefits: [
      'Multi-location support',
      'Travel time calculation',
      'Setup schedules',
      'Breakdown coordination'
    ]
  }
]

const schedulingStats = [
  { number: '95%', label: 'On-Time Events' },
  { number: '60%', label: 'Time Saved' },
  { number: '24/7', label: 'Monitoring' },
  { number: '100%', label: 'Vendor Sync' }
]

const timelinePhases = [
  {
    phase: '12 Months Before',
    tasks: ['Set wedding date', 'Book venue', 'Choose wedding party'],
    duration: '3 months',
    color: 'bg-blue-500'
  },
  {
    phase: '9 Months Before',
    tasks: ['Hire photographer', 'Order dress', 'Plan menu'],
    duration: '2 months',
    color: 'bg-green-500'
  },
  {
    phase: '6 Months Before',
    tasks: ['Send invitations', 'Book florist', 'Plan ceremony'],
    duration: '2 months',
    color: 'bg-yellow-500'
  },
  {
    phase: '3 Months Before',
    tasks: ['Finalize details', 'Schedule fittings', 'Plan rehearsal'],
    duration: '1 month',
    color: 'bg-purple-500'
  },
  {
    phase: '1 Month Before',
    tasks: ['Final payments', 'Confirm vendors', 'Pack for honeymoon'],
    duration: '2 weeks',
    color: 'bg-pink-500'
  },
  {
    phase: 'Wedding Day',
    tasks: ['Get ready', 'Ceremony', 'Reception', 'Celebrate'],
    duration: '1 day',
    color: 'bg-red-500'
  }
]

export default function SchedulingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Calendar className="w-12 h-12 text-indigo-400" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Smart Scheduling
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
                Intelligent timeline management and smart scheduling ensure your wedding day 
                runs perfectly from start to finish.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Create Timeline
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                  View Templates
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Scheduling Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Intelligent Scheduling Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced scheduling tools that adapt to your needs and ensure perfect timing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {schedulingFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
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
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Phases Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Wedding Timeline Phases
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A comprehensive timeline that guides you through every phase of wedding planning.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {timelinePhases.map((phase, index) => (
                  <div key={index} className="flex items-center bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className={`w-4 h-4 ${phase.color} rounded-full mr-6 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{phase.phase}</h3>
                        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                          {phase.duration}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {phase.tasks.map((task, taskIndex) => (
                          <span key={taskIndex} className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scheduling Stats Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Scheduling Performance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real results from couples who use our smart scheduling system.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {schedulingStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-indigo-600 mb-2">
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

        {/* Smart Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  AI-Powered Intelligence
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Our smart scheduling system learns from thousands of successful weddings 
                  to provide you with the most accurate timeline and recommendations.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Zap className="w-6 h-6 text-indigo-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatic Optimization</h3>
                      <p className="text-gray-600">AI continuously optimizes your schedule based on real-time data and vendor availability.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Target className="w-6 h-6 text-indigo-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Conflict Detection</h3>
                      <p className="text-gray-600">Automatically detect and resolve scheduling conflicts before they become problems.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Bell className="w-6 h-6 text-indigo-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Notifications</h3>
                      <p className="text-gray-600">Receive intelligent reminders at the perfect time to keep your planning on track.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
                  <Calendar className="w-32 h-32 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Smart Scheduling Today
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Let our intelligent scheduling system create the perfect timeline for your wedding day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Create Your Timeline
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                View Sample Timeline
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
