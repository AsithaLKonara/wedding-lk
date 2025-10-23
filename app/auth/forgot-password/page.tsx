'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset email. Please try again.');
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
                Check Your Email
              </h1>
              <p className='text-gray-600 mb-6'>
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your email and click the link to reset your password.
              </p>
              <div className='space-y-3'>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-colors'
                >
                  Back to Sign In
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className='w-full text-gray-600 hover:text-gray-800 transition-colors'
                >
                  Try Different Email
                </button>
              </div>
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
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Forgot Password?
            </h1>
            <p className='text-gray-600'>No worries! Enter your email and we'll send you a reset link.</p>
          </div>

          {/* Forgot Password Form */}
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
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
                  required
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

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>
            </form>

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
