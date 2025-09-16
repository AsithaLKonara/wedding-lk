'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, XCircle, ChevronLeft, ChevronRight, Building2, Users, Heart, CheckCircle } from 'lucide-react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';

type UserRole = 'user' | 'vendor' | 'wedding_planner';
type RegistrationStep = 'role' | 'basic' | 'role-specific' | 'verification';

function SignUpForm() {
  // Basic form state
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  // Basic user info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  
  // Location info
  const [country, setCountry] = useState('Sri Lanka');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Vendor-specific fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  
  // Wedding planner specific fields
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for error messages from URL params
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'OAuthSignin':
          setError('Error signing in with Google. Please try again.');
          break;
        case 'OAuthCallback':
          setError('Error with Google authentication. Please try again.');
          break;
        case 'OAuthCreateAccount':
          setError('Could not create account with Google. Please try again.');
          break;
        case 'OAuthAccountNotLinked':
          setError('Account already exists with different provider. Please sign in with the original provider.');
          break;
        default:
          setError('An error occurred during sign up. Please try again.');
      }
    }
  }, [searchParams]);

  // Step navigation functions
  const nextStep = () => {
    if (currentStep === 'role' && selectedRole) {
      setCurrentStep('basic');
    } else if (currentStep === 'basic') {
      setCurrentStep('role-specific');
    } else if (currentStep === 'role-specific') {
      setCurrentStep('verification');
    }
  };

  const prevStep = () => {
    if (currentStep === 'basic') {
      setCurrentStep('role');
    } else if (currentStep === 'role-specific') {
      setCurrentStep('basic');
    } else if (currentStep === 'verification') {
      setCurrentStep('role-specific');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const validateCurrentStep = () => {
    if (currentStep === 'role') {
      return selectedRole !== null;
    } else if (currentStep === 'basic') {
      return firstName && lastName && email && password && confirmPassword && phone && city;
    } else if (currentStep === 'role-specific') {
      if (selectedRole === 'vendor') {
        return businessName && businessType && yearsInBusiness && services.length > 0;
      } else if (selectedRole === 'wedding_planner') {
        return professionalTitle && yearsOfExperience && specialization.length > 0;
      }
      return true;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth,
        gender,
        role: selectedRole,
        location: {
          country,
          state,
          city,
          zipCode,
        },
        // Role-specific data
        ...(selectedRole === 'vendor' && {
          businessName,
          businessType,
          yearsInBusiness: parseInt(yearsInBusiness),
          businessRegistrationNumber,
          taxId,
          services,
          serviceAreas,
        }),
        ...(selectedRole === 'wedding_planner' && {
          professionalTitle,
          yearsOfExperience: parseInt(yearsOfExperience),
          specialization,
          languages,
          businessPhone,
          businessEmail,
        }),
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto sign-in after successful registration
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/dashboard');
        } else {
          // Redirect to sign-in page with success message
          router.push('/auth/signin?message=Account created successfully! Please sign in.');
        }
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Error signing up with Google. Please try again.');
      setIsLoading(false);
    }
  };

  // Service options for vendors
  const vendorServices = [
    'Photography', 'Videography', 'Catering', 'Floral Design', 'Music & DJ',
    'Wedding Cake', 'Hair & Makeup', 'Wedding Attire', 'Transportation',
    'Venue Decoration', 'Lighting', 'Sound System', 'Wedding Favors',
    'Invitations', 'Wedding Planning', 'Event Management'
  ];

  const weddingPlannerSpecializations = [
    'Traditional Weddings', 'Modern Weddings', 'Destination Weddings',
    'Intimate Weddings', 'Large Scale Events', 'Cultural Weddings',
    'Outdoor Weddings', 'Indoor Weddings', 'Budget Weddings',
    'Luxury Weddings', 'Corporate Events', 'Private Parties'
  ];

  const availableLanguages = ['Sinhala', 'Tamil', 'English', 'Hindi', 'Arabic', 'French', 'German', 'Spanish'];
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'role':
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-xl font-semibold mb-2'>Choose Your Role</h2>
              <p className='text-gray-600'>Select how you'd like to use WeddingLK</p>
            </div>

            <div className='space-y-4'>
              {/* Regular User */}
              <button
                type='button'
                onClick={() => handleRoleSelect('user')}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedRole === 'user'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className='flex items-start space-x-4'>
                  <div className={`p-3 rounded-lg ${
                    selectedRole === 'user' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Heart className={`w-6 h-6 ${
                      selectedRole === 'user' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className='text-left flex-1'>
                    <h3 className='font-semibold text-gray-900'>Planning My Wedding</h3>
                    <p className='text-sm text-gray-600 mb-2'>Find vendors, plan your perfect day</p>
                    <div className='text-xs text-gray-500 space-y-1'>
                      <div>✓ AI-powered vendor recommendations</div>
                      <div>✓ Budget planning tools</div>
                      <div>✓ Guest list management</div>
                      <div>✓ Social feed & inspiration</div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Vendor */}
              <button
                type='button'
                onClick={() => handleRoleSelect('vendor')}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedRole === 'vendor'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className='flex items-start space-x-4'>
                  <div className={`p-3 rounded-lg ${
                    selectedRole === 'vendor' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Building2 className={`w-6 h-6 ${
                      selectedRole === 'vendor' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className='text-left flex-1'>
                    <h3 className='font-semibold text-gray-900'>Wedding Vendor</h3>
                    <p className='text-sm text-gray-600 mb-2'>Offer services to couples</p>
                    <div className='text-xs text-gray-500 space-y-1'>
                      <div>✓ Professional vendor dashboard</div>
                      <div>✓ Booking management system</div>
                      <div>✓ Payment processing & invoicing</div>
                      <div>✓ Marketing & promotion tools</div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Wedding Planner */}
              <button
                type='button'
                onClick={() => handleRoleSelect('wedding_planner')}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedRole === 'wedding_planner'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className='flex items-start space-x-4'>
                  <div className={`p-3 rounded-lg ${
                    selectedRole === 'wedding_planner' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Users className={`w-6 h-6 ${
                      selectedRole === 'wedding_planner' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className='text-left flex-1'>
                    <h3 className='font-semibold text-gray-900'>Wedding Planner</h3>
                    <p className='text-sm text-gray-600 mb-2'>Help couples plan their special day</p>
                    <div className='text-xs text-gray-500 space-y-1'>
                      <div>✓ Client management system</div>
                      <div>✓ Task & timeline planning</div>
                      <div>✓ Vendor coordination tools</div>
                      <div>✓ Portfolio showcase</div>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Social Sign Up Options */}
            <div className='space-y-3'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>
                    Or sign up with
                  </span>
                </div>
              </div>

              <button
                type='button'
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className='w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <svg className='w-5 h-5 mr-3' viewBox='0 0 24 24'>
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                {isLoading ? 'Signing up...' : 'Continue with Google'}
              </button>
            </div>
          </div>
        );

      case 'basic':
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-xl font-semibold mb-2'>Basic Information</h2>
              <p className='text-gray-600'>Tell us about yourself</p>
            </div>

            <form className='space-y-4'>
              {/* Name Fields */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    First Name
                  </label>
                  <input
                    type='text'
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='First name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='Last name'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='Enter your email'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='+94 77 123 4567'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Date of Birth
                  </label>
                  <input
                    type='date'
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  >
                    <option value=''>Select Gender</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                    <option value='prefer_not_to_say'>Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  City
                </label>
                <input
                  type='text'
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='Colombo'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10'
                    placeholder='Create a password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10'
                    placeholder='Confirm your password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        );

      case 'role-specific':
        if (selectedRole === 'vendor') {
          return (
            <div className='space-y-6'>
              <div className='text-center'>
                <h2 className='text-xl font-semibold mb-2'>Business Information</h2>
                <p className='text-gray-600'>Tell us about your business</p>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Business Name
                  </label>
                  <input
                    type='text'
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='Your business name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Business Type
                  </label>
                  <select
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  >
                    <option value=''>Select Business Type</option>
                    <option value='individual'>Individual/Freelancer</option>
                    <option value='company'>Company</option>
                    <option value='partnership'>Partnership</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Years in Business
                  </label>
                  <input
                    type='number'
                    value={yearsInBusiness}
                    onChange={e => setYearsInBusiness(e.target.value)}
                    required
                    min='0'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='5'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Services You Offer
                  </label>
                  <div className='grid grid-cols-2 gap-2'>
                    {vendorServices.map((service) => (
                      <label key={service} className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          checked={services.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setServices([...services, service]);
                            } else {
                              setServices(services.filter(s => s !== service));
                            }
                          }}
                          className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
                        />
                        <span className='text-sm text-gray-700'>{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subscription Plan Info */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <h4 className='font-semibold text-blue-900 mb-2'>Vendor Subscription Plans</h4>
                  <div className='space-y-2 text-sm text-blue-800'>
                    <div className='flex justify-between'>
                      <span>Basic Plan:</span>
                      <span className='font-medium'>Free - Up to 5 services</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Professional Plan:</span>
                      <span className='font-medium'>$29/month - Unlimited services</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Premium Plan:</span>
                      <span className='font-medium'>$59/month - Priority listing + analytics</span>
                    </div>
                  </div>
                  <p className='text-xs text-blue-600 mt-2'>
                    Start with Basic plan and upgrade anytime. No setup fees!
                  </p>
                </div>
              </div>
            </div>
          );
        } else if (selectedRole === 'wedding_planner') {
          return (
            <div className='space-y-6'>
              <div className='text-center'>
                <h2 className='text-xl font-semibold mb-2'>Professional Information</h2>
                <p className='text-gray-600'>Tell us about your planning expertise</p>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Professional Title
                  </label>
                  <input
                    type='text'
                    value={professionalTitle}
                    onChange={e => setProfessionalTitle(e.target.value)}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='Wedding Planner, Event Coordinator, etc.'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Years of Experience
                  </label>
                  <input
                    type='number'
                    value={yearsOfExperience}
                    onChange={e => setYearsOfExperience(e.target.value)}
                    required
                    min='0'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='3'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Specializations
                  </label>
                  <div className='grid grid-cols-2 gap-2'>
                    {weddingPlannerSpecializations.map((spec) => (
                      <label key={spec} className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          checked={specialization.includes(spec)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSpecialization([...specialization, spec]);
                            } else {
                              setSpecialization(specialization.filter(s => s !== spec));
                            }
                          }}
                          className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
                        />
                        <span className='text-sm text-gray-700'>{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Languages You Speak
                  </label>
                  <div className='grid grid-cols-2 gap-2'>
                    {availableLanguages.map((lang) => (
                      <label key={lang} className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          checked={languages.includes(lang)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLanguages([...languages, lang]);
                            } else {
                              setLanguages(languages.filter(l => l !== lang));
                            }
                          }}
                          className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
                        />
                        <span className='text-sm text-gray-700'>{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Wedding Planner Subscription Info */}
                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                  <h4 className='font-semibold text-green-900 mb-2'>Wedding Planner Plans</h4>
                  <div className='space-y-2 text-sm text-green-800'>
                    <div className='flex justify-between'>
                      <span>Starter Plan:</span>
                      <span className='font-medium'>Free - Up to 3 active clients</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Professional Plan:</span>
                      <span className='font-medium'>$49/month - Up to 10 clients</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Enterprise Plan:</span>
                      <span className='font-medium'>$99/month - Unlimited clients + white-label</span>
                    </div>
                  </div>
                  <p className='text-xs text-green-600 mt-2'>
                    Professional tools included: Client management, timeline planning, vendor coordination
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return null;

      case 'verification':
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-xl font-semibold mb-2'>Review & Complete</h2>
              <p className='text-gray-600'>Review your information and agree to terms</p>
            </div>

            <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Name:</span>
                <span className='font-medium'>{firstName} {lastName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Email:</span>
                <span className='font-medium'>{email}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Role:</span>
                <span className='font-medium capitalize'>{selectedRole?.replace('_', ' ')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Location:</span>
                <span className='font-medium'>{city}, {state}</span>
              </div>
              {selectedRole === 'vendor' && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Business:</span>
                  <span className='font-medium'>{businessName}</span>
                </div>
              )}
              {selectedRole === 'wedding_planner' && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Title:</span>
                  <span className='font-medium'>{professionalTitle}</span>
                </div>
              )}
            </div>

            {/* Verification Process Info */}
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
              <h4 className='font-semibold text-yellow-900 mb-2'>Verification Process</h4>
              <div className='space-y-2 text-sm text-yellow-800'>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                  <span>Email verification required</span>
                </div>
                {selectedRole === 'vendor' && (
                  <>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                      <span>Business document verification (24-48 hours)</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                      <span>Service portfolio review</span>
                    </div>
                  </>
                )}
                {selectedRole === 'wedding_planner' && (
                  <>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                      <span>Professional certification verification</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                      <span>Portfolio and experience review</span>
                    </div>
                  </>
                )}
              </div>
              <p className='text-xs text-yellow-600 mt-2'>
                Verified accounts get priority in search results and special badges!
              </p>
            </div>

            <div className='flex items-start space-x-3'>
              <input
                type='checkbox'
                id='agreeToTerms'
                checked={agreeToTerms}
                onChange={e => setAgreeToTerms(e.target.checked)}
                className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1'
              />
              <label htmlFor='agreeToTerms' className='text-sm text-gray-700'>
                I agree to the{' '}
                <a href='/terms' className='text-purple-600 hover:text-purple-500 font-medium'>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href='/privacy' className='text-purple-600 hover:text-purple-500 font-medium'>
                  Privacy Policy
                </a>
              </label>
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-3'>
                <XCircle className='w-4 h-4 text-red-600 mt-0.5' />
                <p className='text-sm text-red-700'>{error}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'>
      <Header />
      <div className='flex items-center justify-center p-4 pt-20 pb-20'>
        <div className='w-full max-w-2xl'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Join WeddingLK
          </h1>
          <p className='text-gray-600'>Create your account and start your wedding journey</p>
          
          {/* Social Proof */}
          <div className='mt-4 flex justify-center items-center space-x-4 text-sm text-gray-500'>
            <div className='flex items-center space-x-1'>
              <span className='font-semibold text-purple-600'>10,000+</span>
              <span>Happy Couples</span>
            </div>
            <div className='flex items-center space-x-1'>
              <span className='font-semibold text-purple-600'>500+</span>
              <span>Verified Vendors</span>
            </div>
            <div className='flex items-center space-x-1'>
              <span className='font-semibold text-purple-600'>4.9★</span>
              <span>Average Rating</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className='flex justify-center mb-8'>
          <div className='flex items-center space-x-4'>
            {['role', 'basic', 'role-specific', 'verification'].map((step, index) => (
              <div key={step} className='flex items-center'>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step
                    ? 'bg-purple-600 text-white'
                    : index < ['role', 'basic', 'role-specific', 'verification'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < ['role', 'basic', 'role-specific', 'verification'].indexOf(currentStep) ? (
                    <CheckCircle className='w-5 h-5' />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    index < ['role', 'basic', 'role-specific', 'verification'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className='flex justify-between mt-8'>
            {currentStep !== 'role' && (
              <button
                type='button'
                onClick={prevStep}
                className='flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
              >
                <ChevronLeft className='w-4 h-4 mr-1' />
                Back
              </button>
            )}

            <div className='ml-auto'>
              {currentStep !== 'verification' ? (
                <button
                  type='button'
                  onClick={nextStep}
                  disabled={!validateCurrentStep()}
                  className='flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Next
                  <ChevronRight className='w-4 h-4 ml-1' />
                </button>
              ) : (
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={isLoading || !agreeToTerms}
                  className='px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </div>

          {/* Sign In Link */}
          <div className='text-center mt-6'>
            <p className='text-sm text-gray-600'>
              Already have an account?{' '}
              <a
                href='/auth/signin'
                className='text-purple-600 hover:text-purple-500 font-medium'
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'>
        <Header />
        <div className='flex items-center justify-center p-4 pt-20 pb-20'>
          <div className='w-full max-w-2xl'>
            <div className='bg-white rounded-2xl shadow-xl p-8 text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4'></div>
              <p className='text-gray-600'>Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
