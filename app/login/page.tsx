'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, XCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>WeddingLK</h1>
          <p className='text-gray-600'>Sign in to your account</p>
        </div>

        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <h2 className='text-2xl font-semibold text-center mb-6'>Welcome Back</h2>

          {error && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2'>
              <XCircle className='h-5 w-5 text-red-500 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='your@email.com'
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
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
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12'
                  placeholder='Enter your password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-4 flex items-center'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg'
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-600'>
            Don't have an account?{' '}
            <a href='/register' className='text-purple-600 hover:text-purple-500 font-medium'>
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}