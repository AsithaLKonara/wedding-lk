import { Metadata } from 'next'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { Shield, Lock, Eye, Key, Database, AlertTriangle, CheckCircle, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Security & Privacy | WeddingLK',
  description: 'Learn about WeddingLK\'s enterprise-grade security measures protecting your wedding data and personal information.',
}

const securityFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All your data is encrypted using industry-standard AES-256 encryption.',
    benefits: [
      'Data encrypted in transit and at rest',
      'Zero-knowledge architecture',
      'Military-grade encryption standards',
      'Regular security audits'
    ]
  },
  {
    icon: Shield,
    title: 'Multi-Factor Authentication',
    description: 'Protect your account with multiple layers of security verification.',
    benefits: [
      'SMS and email verification',
      'Authenticator app support',
      'Biometric authentication',
      'Backup recovery codes'
    ]
  },
  {
    icon: Database,
    title: 'Secure Data Storage',
    description: 'Your wedding data is stored in secure, SOC 2 compliant data centers.',
    benefits: [
      'SOC 2 Type II compliance',
      'Regular data backups',
      'Geographic data distribution',
      'Disaster recovery protocols'
    ]
  },
  {
    icon: Eye,
    title: 'Privacy Controls',
    description: 'Complete control over your data visibility and sharing preferences.',
    benefits: [
      'Granular privacy settings',
      'Data export capabilities',
      'Account deletion options',
      'Consent management'
    ]
  },
  {
    icon: Key,
    title: 'Access Control',
    description: 'Role-based access control ensures only authorized users can access your data.',
    benefits: [
      'Role-based permissions',
      'Session management',
      'Device tracking',
      'Suspicious activity alerts'
    ]
  },
  {
    icon: AlertTriangle,
    title: 'Threat Detection',
    description: 'Advanced AI-powered threat detection monitors for suspicious activities.',
    benefits: [
      'Real-time threat monitoring',
      'Automated incident response',
      'Security breach notifications',
      'Continuous vulnerability scanning'
    ]
  }
]

const complianceStandards = [
  {
    name: 'SOC 2 Type II',
    description: 'Audited security controls for data protection',
    status: 'Certified'
  },
  {
    name: 'GDPR Compliant',
    description: 'European data protection regulation compliance',
    status: 'Compliant'
  },
  {
    name: 'CCPA Compliant',
    description: 'California consumer privacy act compliance',
    status: 'Compliant'
  },
  {
    name: 'ISO 27001',
    description: 'International information security management',
    status: 'Certified'
  }
]

const securityStats = [
  { number: '99.9%', label: 'Uptime Guarantee' },
  { number: '256-bit', label: 'AES Encryption' },
  { number: '24/7', label: 'Security Monitoring' },
  { number: '0', label: 'Data Breaches' }
]

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Shield className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Enterprise-Grade Security
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Your wedding data is protected by industry-leading security measures and privacy controls. 
                We take your trust seriously.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  View Security Report
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Advanced Security Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Multiple layers of security protect your wedding data from unauthorized access and cyber threats.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white">
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
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Compliance & Certifications
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We maintain the highest standards of security compliance and data protection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {complianceStandards.map((standard, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{standard.name}</h3>
                  <p className="text-gray-600 mb-4">{standard.description}</p>
                  <Badge className="bg-green-100 text-green-800">{standard.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Stats Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Security by the Numbers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our security measures deliver measurable results in protecting your data.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {securityStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-green-600 mb-2">
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

        {/* Privacy Controls Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Your Privacy, Your Control
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  We believe you should have complete control over your personal data. 
                  Our privacy controls give you the power to manage how your information is used and shared.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Export</h3>
                      <p className="text-gray-600">Download all your wedding data in a portable format anytime.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Deletion</h3>
                      <p className="text-gray-600">Permanently delete your account and all associated data.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Consent Management</h3>
                      <p className="text-gray-600">Control what data we collect and how we use it.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center">
                  <Users className="w-32 h-32 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trust WeddingLK with Your Data
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Join thousands of couples who trust WeddingLK to keep their wedding data secure and private.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Start Planning Securely
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                Contact Security Team
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
