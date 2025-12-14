'use client'

import { useState, useEffect } from 'react'

export default function DebugRuntimePage() {
  const [status, setStatus] = useState('Loading...')
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const runTests = async () => {
      const testErrors: string[] = []

      try {
        // Test 1: Basic component rendering
        setStatus('Testing basic rendering...')
        
        // Test 2: API calls
        setStatus('Testing API calls...')
        try {
          const response = await fetch('/api/home/featured-vendors')
          if (!response.ok) {
            testErrors.push(`API call failed: ${response.status} ${response.statusText}`)
          } else {
            const data = await response.json()
            if (!data.success) {
              testErrors.push(`API returned error: ${data.error}`)
            }
          }
        } catch (error) {
          testErrors.push(`API call error: ${error}`)
        }

        // Test 3: Database connection
        setStatus('Testing database connection...')
        try {
          const response = await fetch('/api/debug/db')
          if (!response.ok) {
            testErrors.push(`Database test failed: ${response.status}`)
          }
        } catch (error) {
          testErrors.push(`Database test error: ${error}`)
        }

        // Test 4: Environment variables
        setStatus('Testing environment...')
        if (!process.env.NEXT_PUBLIC_APP_URL) {
          testErrors.push('NEXT_PUBLIC_APP_URL not set')
        }

        setErrors(testErrors)
        setStatus(testErrors.length === 0 ? 'All tests passed!' : `Found ${testErrors.length} issues`)
      } catch (error) {
        setErrors([`Runtime error: ${error}`])
        setStatus('Runtime error occurred')
      }
    }

    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Runtime Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status: {status}</h2>
          
          {errors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Issues Found:</h3>
              <ul className="list-disc list-inside space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-600">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
            <p><strong>NEXT_PUBLIC_APP_URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server side'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

