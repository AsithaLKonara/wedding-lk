'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Users, Building2, Calendar, Award } from 'lucide-react';

interface RoleOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  requirements: string[];
  color: string;
  popular?: boolean;
}

const roleOptions: RoleOption[] = [
  {
    id: 'user',
    title: 'Wedding Couple',
    description: 'Plan your perfect wedding with our comprehensive platform',
    icon: <Users className="w-8 h-8" />,
    features: [
      'Find and compare vendors and venues',
      'Plan your wedding timeline',
      'Manage your budget and expenses',
      'Get AI-powered recommendations',
      'Access planning tools and checklists',
      'Connect with wedding professionals'
    ],
    requirements: [
      'Valid email address',
      'Basic personal information',
      'Wedding planning preferences'
    ],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'vendor',
    title: 'Vendor/Service Provider',
    description: 'Showcase your services to couples planning their special day',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Create comprehensive business profile',
      'Showcase your portfolio and work',
      'Receive booking requests and inquiries',
      'Manage your services and pricing',
      'Get customer reviews and ratings',
      'Access business analytics and insights'
    ],
    requirements: [
      'Business registration documents',
      'Professional certifications',
      'Portfolio samples and photos',
      'Insurance and liability coverage',
      'Business license verification'
    ],
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'wedding_planner',
    title: 'Wedding Planner',
    description: 'Professional wedding planning and coordination services',
    icon: <Calendar className="w-8 h-8" />,
    features: [
      'Professional profile and credentials',
      'Portfolio showcase of past weddings',
      'Client management and communication',
      'Service package management',
      'Booking and scheduling tools',
      'Professional networking opportunities'
    ],
    requirements: [
      'Professional certification',
      'Portfolio of completed weddings',
      'Business registration',
      'Professional liability insurance',
      'References and testimonials'
    ],
    color: 'from-purple-500 to-violet-500',
    popular: true
  }
];

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
  onBack?: () => void;
}

export function RoleSelection({ onRoleSelect, onBack }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [hoveredRole, setHoveredRole] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the role that best describes how you'll use WeddingLK. 
            Each role comes with specific features and requirements.
          </p>
        </div>

        {/* Back Button */}
        {onBack && (
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              ← Back
            </Button>
          </div>
        )}

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {roleOptions.map((role) => (
            <Card
              key={role.id}
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedRole === role.id 
                  ? 'ring-4 ring-primary shadow-2xl' 
                  : 'hover:shadow-xl'
              } ${
                hoveredRole === role.id ? 'scale-105' : ''
              }`}
              onClick={() => setSelectedRole(role.id)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole('')}
            >
              {/* Popular Badge */}
              {role.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center text-white`}>
                  {role.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {role.title}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {role.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {role.requirements.map((requirement, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">ℹ</span>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selection Indicator */}
                {selectedRole === role.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            disabled={!selectedRole}
            onClick={() => onRoleSelect(selectedRole)}
            className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {selectedRole ? (
              <>
                Continue as {roleOptions.find(r => r.id === selectedRole)?.title}
                <Check className="w-5 h-5 ml-2" />
              </>
            ) : (
              'Select a role to continue'
            )}
          </Button>
          
          {selectedRole && (
            <p className="text-sm text-gray-500 mt-3">
              You can change your role later in your account settings
            </p>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            If you're unsure which role fits you best, you can start as a regular user 
            and upgrade to a vendor or planner account later. Our support team is here 
            to help you make the right choice.
          </p>
        </div>
      </div>
    </div>
  );
} 