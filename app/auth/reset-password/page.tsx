'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, XCircle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    // Validate token
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setIsValidToken(true);
      } else {
        setError(data.error || 'Invalid or expired reset token');
      }
    } catch (err) {
      setError('Error validating reset token');
    }
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

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin?message=Password reset successfully! Please sign in with your new password.');
        }, 2000);
      } else {
        setError(data.error || 'Password reset failed. Please try again.');
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
                Password Reset Successful!
              </h1>
              <p className='text-gray-600 mb-6'>
                Your password has been successfully reset. You will be redirected to the sign-in page shortly.
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
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Reset Your Password
            </h1>
            <p className='text-gray-600'>Enter your new password below</p>
          </div>

          {/* Reset Form */}
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            {!isValidToken && !error ? (
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4'></div>
                <p className='text-gray-600'>Validating reset token...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    New Password
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10'
                      placeholder='Enter your new password'
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
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Confirm New Password
                  </label>
                  <div className='relative'>
                    <input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10'
                      placeholder='Confirm your new password'
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
                  disabled={isLoading || !isValidToken}
                  className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )}

            {/* Back to Sign In */}
            <div className='text-center mt-6'>
              <p className='text-sm text-gray-600'>
                Remember your password?{' '}
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

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  );
}
