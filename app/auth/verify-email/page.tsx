'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';

function VerifyEmailForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin?message=Email verified successfully! Please sign in.');
        }, 3000);
      } else {
        setError(data.error || 'Email verification failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin?message=Verification email sent! Please check your inbox.');
        }, 2000);
      } else {
        setError(data.error || 'Failed to send verification email. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'>
        <Header />
        <div className='flex items-center justify-center p-4 pt-20 pb-20'>
          <div className='w-full max-w-md'>
            <div className='bg-white rounded-2xl shadow-xl p-8 text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckCircle className='w-8 h-8 text-green-600' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                Email Verified Successfully!
              </h1>
              <p className='text-gray-600 mb-6'>
                Your email has been verified. You will be redirected to the sign-in page shortly.
              </p>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto'></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'>
      <Header />
      <div className='flex items-center justify-center p-4 pt-20 pb-20'>
        <div className='w-full max-w-md'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Mail className='w-8 h-8 text-purple-600' />
            </div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Verify Your Email
            </h1>
            <p className='text-gray-600'>Check your email for a verification link</p>
          </div>

          {/* Verification Form */}
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            {isLoading ? (
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4'></div>
                <p className='text-gray-600'>
                  {token ? 'Verifying your email...' : 'Sending verification email...'}
                </p>
              </div>
            ) : (
              <div className='space-y-6'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Email Address
                  </label>
                  <input
                    id='email'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='Enter your email address'
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-3'>
                    <XCircle className='w-4 h-4 text-red-600 mt-0.5' />
                    <p className='text-sm text-red-700'>{error}</p>
                  </div>
                )}

                {/* Resend Button */}
                <button
                  onClick={resendVerification}
                  disabled={isLoading}
                  className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Resend Verification Email
                </button>
              </div>
            )}

            {/* Back to Sign In */}
            <div className='text-center mt-6'>
              <button
                onClick={() => router.push('/auth/signin')}
                className='flex items-center justify-center mx-auto text-gray-600 hover:text-gray-800 transition-colors'
              >
                <ArrowLeft className='w-4 h-4 mr-1' />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'>
        <Header />
        <div className='flex items-center justify-center p-4 pt-20 pb-20'>
          <div className='w-full max-w-md'>
            <div className='bg-white rounded-2xl shadow-xl p-8 text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4'></div>
              <p className='text-gray-600'>Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
