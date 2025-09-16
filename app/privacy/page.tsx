'use client';

import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <strong>Account Information:</strong> Name, email address, phone number, and profile information
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <strong>Communication Data:</strong> Messages, reviews, and feedback you provide
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <strong>Usage Data:</strong> How you interact with our platform, pages visited, and features used
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <strong>Technical Data:</strong> IP address, browser type, device information, and cookies
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Delivery</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Provide wedding planning services</li>
                  <li>• Connect you with vendors and venues</li>
                  <li>• Process bookings and payments</li>
                  <li>• Send important service updates</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Improvement</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Analyze usage patterns</li>
                  <li>• Improve user experience</li>
                  <li>• Develop new features</li>
                  <li>• Ensure platform security</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Data Protection</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
                  <p className="text-sm text-gray-600">All data is encrypted in transit and at rest</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Access Control</h3>
                  <p className="text-sm text-gray-600">Strict access controls and authentication</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Storage</h3>
                  <p className="text-sm text-gray-600">Data stored in secure, monitored systems</p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Access & Control</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• View and update your personal information</li>
                    <li>• Download your data</li>
                    <li>• Delete your account</li>
                    <li>• Opt-out of marketing communications</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Controls</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Control who can see your profile</li>
                    <li>• Manage notification preferences</li>
                    <li>• Set privacy levels for posts</li>
                    <li>• Control data sharing with vendors</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Cookies & Tracking</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your experience and analyze platform usage.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-sm text-gray-600">Required for basic platform functionality and security</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-gray-600">Help us understand how you use our platform</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                  <p className="text-sm text-gray-600">Used to deliver relevant advertisements and content</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="space-y-2">
                <p><strong>Email:</strong> privacy@weddinglk.com</p>
                <p><strong>Address:</strong> WeddingLK Privacy Team, Colombo, Sri Lanka</p>
                <p><strong>Response Time:</strong> We respond to privacy inquiries within 48 hours</p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Policy Updates</h3>
              <p className="text-blue-800">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes 
                by email or through our platform. Your continued use of WeddingLK after any changes indicates your 
                acceptance of the updated policy.
              </p>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}