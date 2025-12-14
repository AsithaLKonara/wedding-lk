import { Shield, Lock, Eye, CheckCircle, AlertTriangle, Users, FileText, Clock } from 'lucide-react'

export default function SecurityFeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
                </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Enterprise-Grade Security
              </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your wedding data is protected with military-grade security, ensuring complete privacy and peace of mind throughout your planning journey.
            </p>
          </div>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Data Encryption */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">End-to-End Encryption</h3>
            </div>
            <p className="text-gray-600 mb-4">
              All your wedding data is encrypted using AES-256 encryption, the same standard used by banks and government agencies.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Personal information protection
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Secure file storage
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Encrypted communications
              </li>
            </ul>
          </div>

          {/* Privacy Controls */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Privacy Controls</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Complete control over who can see your wedding details, with granular privacy settings for every aspect of your planning.
                  </p>
                  <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Guest list privacy
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Vendor information control
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Social media integration
                      </li>
                  </ul>
                </div>

          {/* Secure Authentication */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Multi-Factor Authentication</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Advanced authentication with 2FA, biometric login, and secure session management to protect your account.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Two-factor authentication
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Biometric login support
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Session timeout protection
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">GDPR Compliance</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Full compliance with international data protection regulations, ensuring your rights are protected.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Right to data portability
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Right to be forgotten
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Consent management
              </li>
            </ul>
                  </div>

          {/* Audit Logging */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-red-600" />
                </div>
              <h3 className="text-xl font-semibold text-gray-900">Audit Logging</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Complete audit trail of all activities, ensuring transparency and accountability in your wedding planning process.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Activity tracking
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Access logging
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Change history
              </li>
            </ul>
          </div>

          {/* Security Monitoring */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
              <h3 className="text-xl font-semibold text-gray-900">24/7 Security Monitoring</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Continuous monitoring and threat detection to ensure your data remains secure at all times.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Real-time threat detection
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Automated security updates
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Incident response
              </li>
            </ul>
          </div>
                    </div>
                  </div>
                  
      {/* Security Certifications */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Security Certifications & Standards
            </h2>
            <p className="text-lg text-gray-600">
              We meet the highest industry standards for data protection and security
            </p>
                  </div>
                  
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">ISO 27001</h3>
              <p className="text-sm text-gray-600">Information Security</p>
                    </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
                  </div>
              <h3 className="font-semibold text-gray-900">SOC 2</h3>
              <p className="text-sm text-gray-600">Security Controls</p>
                </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">GDPR</h3>
              <p className="text-sm text-gray-600">Data Protection</p>
                </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">PCI DSS</h3>
              <p className="text-sm text-gray-600">Payment Security</p>
            </div>
          </div>
        </div>
      </div>

        {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your Wedding Data is Safe with Us
            </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Start planning your perfect wedding with complete confidence, knowing your personal information and wedding details are protected by enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
                Start Planning Securely
            </a>
            <a
              href="/help/security"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn More About Security
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}