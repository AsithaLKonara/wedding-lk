'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowLeft,
  ArrowRight,
  Save,
  Eye
} from 'lucide-react';
import { RoleSelection } from '@/components/auth/role-selection';
import { EnhancedRegistrationForm } from '@/components/auth/enhanced-registration-form';
import { DocumentUpload } from '@/components/auth/document-upload';
import { RegistrationProgress } from '@/components/auth/registration-progress';
import { SocialLoginButtons } from '@/components/auth/social-login-buttons';
import { DynamicFormFactory } from '@/lib/forms/dynamic-form-engine';

interface RegistrationData {
  [key: string]: any;
}

interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  required: boolean;
  estimatedTime: number;
}

function EnhancedRegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get role from URL params or default to empty
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['user', 'vendor', 'wedding_planner'].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  // Define registration steps
  const registrationSteps: RegistrationStep[] = [
    {
      id: 'role_selection',
      title: 'Choose Your Role',
      description: 'Select how you want to use WeddingLK',
      status: 'pending',
      required: true,
      estimatedTime: 1
    },
    {
      id: 'basic_info',
      title: 'Basic Information',
      description: 'Enter your personal details and contact information',
      status: 'pending',
      required: true,
      estimatedTime: 5
    },
    {
      id: 'role_specific',
      title: 'Role-Specific Details',
      description: 'Provide information specific to your selected role',
      status: 'pending',
      required: true,
      estimatedTime: 10
    },
    {
      id: 'documents',
      title: 'Document Verification',
      description: 'Upload required documents for verification',
      status: 'pending',
      required: selectedRole === 'vendor' || selectedRole === 'wedding_planner',
      estimatedTime: 15
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your information and complete registration',
      status: 'pending',
      required: true,
      estimatedTime: 3
    }
  ];

  // Update step status based on current progress
  useEffect(() => {
    const updatedSteps = registrationSteps.map((step, index) => {
      if (index < currentStep) {
        return { ...step, status: 'completed' as const };
      } else if (index === currentStep) {
        return { ...step, status: 'in_progress' as const };
      } else {
        return { ...step, status: 'pending' as const };
      }
    });
    // Note: In a real implementation, you'd update the steps state here
  }, [currentStep, selectedRole]);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    setCurrentStep(1); // Move to next step
  };

  const handleFormDataUpdate = (data: RegistrationData) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleStepNavigation = (stepIndex: number) => {
    // Validate current step before allowing navigation
    if (stepIndex > currentStep && !canProceedToStep(stepIndex)) {
      setError('Please complete the current step before proceeding');
      return;
    }
    setCurrentStep(stepIndex);
    setError(null);
  };

  const canProceedToStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 1: // Basic info
        return !!selectedRole;
      case 2: // Role-specific
        return !!formData.name && !!formData.email;
      case 3: // Documents
        return !!formData.businessName || !!formData.companyName;
      case 4: // Review
        return isCurrentStepComplete();
      default:
        return true;
    }
  };

  const isCurrentStepComplete = (): boolean => {
    switch (currentStep) {
      case 0: // Role selection
        return !!selectedRole;
      case 1: // Basic info
        return !!(formData.name && formData.email && formData.password);
      case 2: // Role-specific
        if (selectedRole === 'vendor') {
          return !!(formData.businessName && formData.category);
        } else if (selectedRole === 'wedding_planner') {
          return !!(formData.companyName && formData.experienceYears);
        }
        return true;
      case 3: // Documents
        return true; // Documents are optional for completion
      default:
        return true;
    }
  };

  const handleSaveProgress = async () => {
    try {
      const progressData = {
        role: selectedRole,
        formData,
        currentStep,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`registration_progress_${selectedRole}`, JSON.stringify(progressData));
      setSuccess('Progress saved successfully!');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to save progress');
    }
  };

  const handleSubmit = async () => {
    if (!isCurrentStepComplete()) {
      setError('Please complete all required fields before submitting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Submit registration data
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const result = await response.json();
      setSuccess('Registration successful! Redirecting to dashboard...');
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (): number => {
    const completedSteps = registrationSteps
      .slice(0, currentStep + 1)
      .filter(step => step.status === 'completed').length;
    
    return (completedSteps / registrationSteps.length) * 100;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Role</CardTitle>
              <CardDescription>
                Select how you want to use WeddingLK. This will determine the features available to you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleSelection onRoleSelect={handleRoleSelection} />
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <EnhancedRegistrationForm
            role={selectedRole}
            onSuccess={handleFormDataUpdate}
            onError={setError}
          />
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Provide additional details specific to your role as a {selectedRole.replace('_', ' ')}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedRegistrationForm
                role={selectedRole}
                onSuccess={handleFormDataUpdate}
                onError={setError}
              />
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
              <CardDescription>
                Upload required documents to verify your identity and qualifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedRole === 'vendor' && (
                  <DocumentUpload
                    documentType="business_license"
                    onUpload={async (file) => {
                      // Handle file upload
                      console.log('Uploading business license:', file);
                    }}
                    onRemove={(fileId) => {
                      // Handle file removal
                      console.log('Removing file:', fileId);
                    }}
                    maxFileSize={10 * 1024 * 1024} // 10MB
                    allowedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                    required={true}
                  />
                )}
                
                {selectedRole === 'wedding_planner' && (
                  <DocumentUpload
                    documentType="professional_certification"
                    onUpload={async (file) => {
                      // Handle file upload
                      console.log('Uploading certification:', file);
                    }}
                    onRemove={(fileId) => {
                      // Handle file removal
                      console.log('Removing file:', fileId);
                    }}
                    maxFileSize={10 * 1024 * 1024} // 10MB
                    allowedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                    required={false}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Review your information before completing registration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) return null;
                    if (value === undefined || value === '') return null;
                    
                    return (
                      <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="text-gray-600">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !isCurrentStepComplete()}
                    className="flex-1"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Complete Registration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your WeddingLK Account
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of couples, vendors, and wedding planners who trust WeddingLK for their wedding needs.
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderCurrentStep()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracking */}
            <RegistrationProgress
              steps={registrationSteps}
              currentStep={currentStep}
              onStepClick={handleStepNavigation}
              onSaveProgress={handleSaveProgress}
              totalProgress={calculateProgress()}
            />

            {/* Social Login */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Sign Up</CardTitle>
                <CardDescription>
                  Already have an account? Sign in with social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialLoginButtons
                  onSuccess={() => router.push('/dashboard')}
                  onError={setError}
                  showDescription={false}
                />
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm text-blue-800">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-blue-700 mb-3">
                  Our support team is here to help you complete your registration.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedRegistrationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnhancedRegistrationContent />
    </Suspense>
  );
} 