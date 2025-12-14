import { Metadata } from 'next'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { HelpCircle, Search, MessageCircle, Phone, Mail, FileText, Users, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Help & Support | WeddingLK',
  description: 'Get help with WeddingLK. Find answers to common questions, contact support, and access user guides.',
}

const helpCategories = [
  {
    icon: FileText,
    title: 'Getting Started',
    description: 'Learn the basics of using WeddingLK',
    articles: [
      'How to create an account',
      'Setting up your profile',
      'Understanding your dashboard',
      'Finding vendors and venues'
    ]
  },
  {
    icon: Users,
    title: 'Account & Profile',
    description: 'Manage your account and profile settings',
    articles: [
      'Updating your profile information',
      'Changing your password',
      'Managing notifications',
      'Account security settings'
    ]
  },
  {
    icon: Settings,
    title: 'Booking & Payments',
    description: 'Everything about booking vendors and making payments',
    articles: [
      'How to book a vendor',
      'Payment methods accepted',
      'Cancellation and refunds',
      'Booking modifications'
    ]
  },
  {
    icon: MessageCircle,
    title: 'Communication',
    description: 'Using messaging and communication features',
    articles: [
      'Sending messages to vendors',
      'Managing conversations',
      'Notification settings',
      'File sharing and attachments'
    ]
  }
]

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    action: 'Start Chat',
    available: 'Available 24/7'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us an email and we\'ll respond within 24 hours',
    action: 'Send Email',
    available: 'Response within 24h'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our support team',
    action: 'Call Now',
    available: 'Mon-Fri 9AM-6PM'
  }
]

const faqs = [
  {
    question: 'How do I create a WeddingLK account?',
    answer: 'Creating an account is easy! Click the "Get Started" button on our homepage, fill in your details, and verify your email address. You can also sign up using your Google or Facebook account for faster registration.'
  },
  {
    question: 'Is WeddingLK free to use?',
    answer: 'Yes! WeddingLK offers a free tier that includes basic features like browsing vendors, creating a profile, and basic planning tools. We also offer premium plans with advanced features for couples who want more comprehensive planning assistance.'
  },
  {
    question: 'How do I book a vendor through WeddingLK?',
    answer: 'To book a vendor, first browse our vendor directory, view their profile and services, then click "Book Now" or "Send Inquiry". You can communicate with the vendor directly through our messaging system to discuss details before confirming your booking.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.'
  },
  {
    question: 'Can I cancel or modify my booking?',
    answer: 'Yes, you can modify or cancel your booking through your dashboard. Cancellation policies vary by vendor, so please check the specific terms before booking. We recommend contacting the vendor directly for any modifications.'
  },
  {
    question: 'How do I contact vendor support?',
    answer: 'You can contact vendor support through our messaging system in your dashboard, or use our live chat feature for immediate assistance. We also provide email and phone support during business hours.'
  }
]

export default function HelpPage() {
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
                  <HelpCircle className="w-12 h-12 text-yellow-400" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Help & Support
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                We're here to help you plan your perfect wedding. Find answers, get support, and make the most of WeddingLK.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for help articles, FAQs, or topics..."
                    className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Help Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Browse Help Topics
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find the information you need quickly with our organized help categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {helpCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white">
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 ml-4">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex} className="flex items-center text-sm text-gray-700 hover:text-purple-600 cursor-pointer">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        {article}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quick answers to the most common questions about WeddingLK.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Still Need Help?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our support team is here to help you with any questions or issues you might have.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white">
                      <method.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {method.description}
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300">
                      {method.action}
                    </button>
                    <p className="text-sm text-gray-500">
                      {method.available}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Resources Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Additional Resources
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore more resources to help you make the most of WeddingLK.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">User Guide</h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive guide to all WeddingLK features and functionality.
                </p>
                <button className="text-purple-600 hover:text-purple-700 font-semibold">
                  Read Guide →
                </button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Community Forum</h3>
                <p className="text-gray-600 mb-6">
                  Connect with other couples and share wedding planning experiences.
                </p>
                <button className="text-purple-600 hover:text-purple-700 font-semibold">
                  Join Forum →
                </button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Video Tutorials</h3>
                <p className="text-gray-600 mb-6">
                  Watch step-by-step video tutorials for common tasks and features.
                </p>
                <button className="text-purple-600 hover:text-purple-700 font-semibold">
                  Watch Videos →
                </button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Feedback</h3>
                <p className="text-gray-600 mb-6">
                  Share your feedback and suggestions to help us improve WeddingLK.
                </p>
                <button className="text-purple-600 hover:text-purple-700 font-semibold">
                  Send Feedback →
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
