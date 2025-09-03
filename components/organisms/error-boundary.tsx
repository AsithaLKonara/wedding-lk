"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: ErrorBoundary.generateErrorId()
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }

    // Report error to external service (e.g., Sentry)
    this.reportError(error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // Report to Sentry if configured
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        },
        tags: {
          errorBoundary: true,
          errorId: this.state.errorId
        }
      })
    }

    // Report to custom error tracking service
    this.reportToCustomService(error, errorInfo)
  }

  private async reportToCustomService(error: Error, errorInfo: ErrorInfo) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          timestamp: new Date().toISOString()
        })
      })
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  private handleContactSupport = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'mailto:support@weddinglk.com?subject=Error Report - ' + this.state.errorId
    }
  }

  private getErrorMessage(): string {
    const { error } = this.state
    
    if (!error) return 'An unexpected error occurred'

    // Provide user-friendly error messages based on error type
    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      return 'Network connection error. Please check your internet connection and try again.'
    }
    
    if (error.message.includes('Authentication') || error.message.includes('Unauthorized')) {
      return 'Authentication error. Please log in again to continue.'
    }
    
    if (error.message.includes('Payment') || error.message.includes('Stripe')) {
      return 'Payment processing error. Please try again or contact support if the issue persists.'
    }
    
    if (error.message.includes('Upload') || error.message.includes('File')) {
      return 'File upload error. Please check the file size and format, then try again.'
    }
    
    if (error.message.includes('Database') || error.message.includes('MongoDB')) {
      return 'Database connection error. Please try again in a few moments.'
    }

    return 'Something went wrong. Please try again or contact support if the problem persists.'
  }

  private getErrorCategory(): string {
    const { error } = this.state
    
    if (!error) return 'Unknown'

    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      return 'Network'
    }
    
    if (error.message.includes('Authentication') || error.message.includes('Unauthorized')) {
      return 'Authentication'
    }
    
    if (error.message.includes('Payment') || error.message.includes('Stripe')) {
      return 'Payment'
    }
    
    if (error.message.includes('Upload') || error.message.includes('File')) {
      return 'Upload'
    }
    
    if (error.message.includes('Database') || error.message.includes('MongoDB')) {
      return 'Database'
    }

    return 'Application'
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      const errorCategory = this.getErrorCategory()
      const errorMessage = this.getErrorMessage()

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-gray-600">
                {errorMessage}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Error Category:</span>
                  <Badge variant={errorCategory === 'Network' ? 'destructive' : 'secondary'}>
                    {errorCategory}
                  </Badge>
                </div>
                
                {this.state.errorId && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Error ID:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {this.state.errorId}
                    </code>
                </div>
              )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Button>
              </div>

              {/* Support Information */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 text-center mb-3">
                  Still having issues? Contact our support team
                </p>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={this.handleContactSupport}
                    className="flex-1"
                    variant="outline"
                    size="sm"
                  >
                    <Mail className="mr-2 h-3 w-3" />
                    Email Support
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('tel:+94112345678')}
                    className="flex-1"
                    variant="outline"
                    size="sm"
                  >
                    <Phone className="mr-2 h-3 w-3" />
                    Call Us
                  </Button>
                </div>
              </div>

              {/* Development Info */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Technical Details (Development Only)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    setError(error)
    
    // Report error
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error)
    }
  }, [])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, resetError }
}

// Higher-order component for error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<Props>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
