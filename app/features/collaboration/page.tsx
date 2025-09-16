import { Metadata } from 'next'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { Users, MessageSquare, Calendar, FileText, Bell, Share2, CheckCircle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Collaborative Planning | WeddingLK',
  description: 'Plan your wedding together with family, friends, and vendors using WeddingLK\'s collaborative tools.',
}

const collaborationFeatures = [
  {
    icon: Users,
    title: 'Team Planning',
    description: 'Invite family members and friends to collaborate on your wedding planning.',
    benefits: [
      'Unlimited team members',
      'Role-based permissions',
      'Real-time collaboration',
      'Activity tracking'
    ]
  },
  {
    icon: MessageSquare,
    title: 'Group Messaging',
    description: 'Communicate with your entire wedding team in organized group chats.',
    benefits: [
      'Group conversations',
      'File sharing',
      'Message history',
      'Push notifications'
    ]
  },
  {
    icon: Calendar,
    title: 'Shared Calendar',
    description: 'Keep everyone on the same page with a shared wedding timeline.',
    benefits: [
      'Synchronized schedules',
      'Event reminders',
      'Vendor coordination',
      'Milestone tracking'
    ]
  },
  {
    icon: FileText,
    title: 'Document Sharing',
    description: 'Share contracts, invoices, and important documents with your team.',
    benefits: [
      'Secure file sharing',
      'Version control',
      'Document comments',
      'Access permissions'
    ]
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay updated with intelligent notifications for important events.',
    benefits: [
      'Customizable alerts',
      'Email notifications',
      'SMS reminders',
      'Priority settings'
    ]
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your wedding progress with family and friends easily.',
    benefits: [
      'Social media integration',
      'Photo sharing',
      'Progress updates',
      'Guest communication'
    ]
  }
]

const collaborationStats = [
  { number: '85%', label: 'Faster Planning' },
  { number: '12', label: 'Team Members' },
  { number: '24/7', label: 'Collaboration' },
  { number: '99%', label: 'Team Satisfaction' }
]

const collaborationWorkflow = [
  {
    step: 1,
    title: 'Create Your Team',
    description: 'Invite family members, friends, and vendors to join your wedding planning team.',
    icon: Users
  },
  {
    step: 2,
    title: 'Assign Roles',
    description: 'Set permissions and responsibilities for each team member.',
    icon: CheckCircle
  },
  {
    step: 3,
    title: 'Plan Together',
    description: 'Collaborate on tasks, share ideas, and make decisions together.',
    icon: MessageSquare
  },
  {
    step: 4,
    title: 'Stay Organized',
    description: 'Track progress, manage deadlines, and celebrate milestones.',
    icon: Calendar
  }
]

export default function CollaborationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Users className="w-12 h-12 text-pink-400" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Collaborative Planning
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
                Plan your perfect wedding together with family, friends, and vendors. 
                Collaboration makes everything better.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Collaborating
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Collaboration Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Powerful Collaboration Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to plan your wedding together as a team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collaborationFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white">
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
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collaboration Stats Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Collaboration Results
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how collaborative planning improves your wedding experience.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {collaborationStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-pink-600 mb-2">
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

        {/* Collaboration Workflow Section */}
        <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How Collaboration Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple steps to get your wedding team working together seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {collaborationWorkflow.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Roles Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Team Roles & Permissions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Assign specific roles and permissions to keep your wedding planning organized.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-200">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">Wedding Couple</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Full access to all features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Invite team members
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Make final decisions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Manage budget
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">Family Members</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    View and comment on plans
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Suggest vendors
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Access shared calendar
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Receive notifications
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">Wedding Planner</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Manage timeline
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Coordinate vendors
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Update progress
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Manage tasks
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Planning Together
            </h2>
            <p className="text-xl text-pink-100 mb-8 max-w-3xl mx-auto">
              Invite your family and friends to collaborate on your perfect wedding day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Create Your Team
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
