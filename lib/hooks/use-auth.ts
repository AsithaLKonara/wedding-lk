"use client"

import { useState, useEffect } from 'react'
import type { AuthUser } from '@/lib/rbac'

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setUser(null)
        setLoading(false)
      })
  }, [])

  return { user, loading, error }
}

export function useSignOut() {
  return async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
}

