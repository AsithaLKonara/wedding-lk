"use client"

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: any) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorSafetyWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorSafetyWrapper caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600">Something went wrong. Please refresh the page.</p>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for error safety
export function withErrorSafety<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function ErrorSafeComponent(props: P) {
    return (
      <ErrorSafetyWrapper fallback={fallback}>
        <Component {...props} />
      </ErrorSafetyWrapper>
    )
  }
}

// Hook for safe property access
export function useSafeProperty<T>(obj: T | null | undefined, property: keyof T, fallback: any = null) {
  try {
    return obj?.[property] ?? fallback
  } catch (error) {
    console.warn('Safe property access failed:', error)
    return fallback
  }
}

// Utility function for safe property access
export function safeGet<T>(obj: T | null | undefined, path: string, fallback: any = null) {
  try {
    if (!obj) return fallback
    
    const keys = path.split('.')
    let current: any = obj
    
    for (const key of keys) {
      if (current == null || typeof current !== 'object') {
        return fallback
      }
      current = current[key]
    }
    
    return current ?? fallback
  } catch (error) {
    console.warn('Safe get failed:', error)
    return fallback
  }
}
