'use client';

import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { FileText, Scale, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using WeddingLK. By using our platform, you agree to these terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Acceptance of Terms */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                By accessing and using WeddingLK, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Agreement to Terms</h3>
                <p className="text-green-800 text-sm">
                  By creating an account or using our services, you confirm that you have read, understood, 
                  and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Service Description</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                WeddingLK is a comprehensive wedding planning platform that connects couples with vendors, 
                venues, and wedding professionals to help plan their perfect wedding day.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Services Include</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Vendor and venue discovery</li>
                    <li>• Booking and payment processing</li>
                    <li>• Wedding planning tools</li>
                    <li>• Social features and community</li>
                    <li>• AI-powered recommendations</li>
                    <li>• Customer support</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Features</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• User profiles and portfolios</li>
                    <li>• Review and rating system</li>
                    <li>• Messaging and communication</li>
                    <li>• Event management tools</li>
                    <li>• Payment processing</li>
                    <li>• Mobile applications</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">User Responsibilities</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Security</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Keep your login credentials secure and confidential</li>
                    <li>• Notify us immediately of any unauthorized access</li>
                    <li>• Use strong passwords and enable two-factor authentication</li>
                    <li>• Log out from shared or public devices</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Guidelines</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Provide accurate and truthful information</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Do not post offensive, illegal, or harmful content</li>
                    <li>• Maintain professional communication standards</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="space-y-2">
                <p><strong>Email:</strong> legal@weddinglk.com</p>
                <p><strong>Address:</strong> WeddingLK Legal Team, Colombo, Sri Lanka</p>
                <p><strong>Response Time:</strong> We respond to legal inquiries within 72 hours</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}