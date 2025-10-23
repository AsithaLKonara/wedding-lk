'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, XCircle } from 'lucide-react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';

// Component to handle search params without causing hydration issues
function ErrorHandler({ onError }: { onError: (error: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'CredentialsSignin':
          onError('Invalid email or password. Please try again.');
          break;
        case 'OAuthSignin':
          onError('Error signing in with Google. Please try again.');
          break;
        case 'OAuthCallback':
          onError('Error with Google authentication. Please try again.');
          break;
        case 'OAuthCreateAccount':
          onError('Could not create account with Google. Please try again.');
          break;
        case 'EmailCreateAccount':
          onError('Could not create account. Please try again.');
          break;
        case 'Callback':
          onError('Authentication error. Please try again.');
          break;
        case 'OAuthAccountNotLinked':
          onError('Account already exists with different provider. Please sign in with the original provider.');
          break;
        case 'EmailSignin':
          onError('Check your email for a sign-in link.');
          break;
        case 'SessionRequired':
          onError('Please sign in to access this page.');
          break;
        default:
          onError('An error occurred during sign in. Please try again.');
      }
    }
  }, [searchParams, onError]);

  return null;
}

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        // Check if user is already signed in
        const session = await getSession();
        if (session) {
          router.push('/dashboard');
        } else {
          setError('Sign in successful but session not established. Please try again.');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Error signing in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'>
      <Header />
      <Suspense fallback={<div />}>
        <ErrorHandler onError={setError} />
      </Suspense>
      <div className='flex items-center justify-center p-4 pt-20 pb-20'>
        <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Welcome Back
          </h1>
          <p className='text-gray-600'>Sign in to your WeddingLK account</p>
          
          {/* Trust Indicators */}
          <div className='mt-4 flex justify-center items-center space-x-6 text-xs text-gray-500'>
            <div className='flex items-center space-x-1'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span>SSL Secured</span>
            </div>
            <div className='flex items-center space-x-1'>
              <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
              <span>GDPR Compliant</span>
            </div>
            <div className='flex items-center space-x-1'>
              <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
              <span>Trusted Platform</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          {/* Login Header */}
          <div className='text-center pb-4'>
            <h2 className='text-xl font-semibold'>Sign In</h2>
          </div>

          <div className='space-y-6'>
            {/* Social Login buttons */}
            <div className='space-y-3'>
              <button
                type='button'
                onClick={handleGoogleSignIn}
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
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              <button
                type='button'
                className='w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              >
                <svg
                  className='w-5 h-5 mr-3'
                  fill='#1877F2'
                  viewBox='0 0 24 24'
                >
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
                Continue with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Email Address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='Enter your email'
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10'
                    placeholder='Enter your password'
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

              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
                  />
                  <span className='ml-2 text-sm text-gray-700'>
                    Remember me
                  </span>
                </label>
                <a
                  href='/auth/forgot-password'
                  className='text-sm text-purple-600 hover:text-purple-500'
                >
                  Forgot password?
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-3'>
                  <XCircle className='w-4 h-4 text-red-600 mt-0.5' />
                  <p className='text-sm text-red-700'>{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{' '}
                <a
                  href='/auth/signup'
                  className='text-purple-600 hover:text-purple-500 font-medium'
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SignInPage() {
  return <SignInForm />;
}

