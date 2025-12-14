"use client"

import React, { useState, useEffect, useRef, lazy } from 'react'
import { LoadingSpinner } from './loading-spinner'

interface LazyLoadingProps {
  children: React.ReactNode
  placeholder?: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazyLoading({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  className = ''
}: LazyLoadingProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div ref={ref} className={className}>
      {!isVisible ? (
        placeholder || (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner text="Loading..." />
          </div>
        )
      ) : !isLoaded ? (
        <div onLoad={handleLoad}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

// Lazy load images with blur placeholder
interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState(placeholder || src)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }
  }, [src])

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-50'
      } ${className}`}
    />
  )
}

// Lazy load components with dynamic import
interface LazyComponentProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>
  fallback?: React.ReactNode
  props?: Record<string, any>
}

export function LazyComponent({
  importFunc,
  fallback,
  props = {}
}: LazyComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    importFunc()
      .then((module) => {
        setComponent(() => module.default)
      })
      .catch((error) => {
        console.error('Failed to load component:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [importFunc])

  if (isLoading) {
    return fallback || <LoadingSpinner text="Loading component..." />
  }

  if (!Component) {
    return <div>Failed to load component</div>
  }

  return <Component {...props} />
}
