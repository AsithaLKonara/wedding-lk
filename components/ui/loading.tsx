"use client"

import { Suspense } from 'react'

interface PageLoadingProps {
  text?: string
  className?: string
}

export function PageLoading({ text = "Loading...", className = "" }: PageLoadingProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </div>
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} ${className}`}></div>
  )
}

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle'
  className?: string
}

export function SkeletonLoader({ variant = 'card', className = '' }: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'
  
  const variants = {
    card: 'rounded-lg',
    text: 'rounded',
    circle: 'rounded-full'
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}></div>
  )
}

interface SuspenseWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      {children}
    </Suspense>
  )
}
