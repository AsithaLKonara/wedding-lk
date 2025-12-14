"use client"

import { useEffect } from 'react'

export function ServiceWorkerProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      console.log('Service Worker: Starting registration process...')
      
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('Service Worker: Registration succeeded. Scope is', registration.scope)
          console.log('Service Worker: Registration object:', registration)
          
          // Check if service worker is already active
          if (registration.active) {
            console.log('Service Worker: Already active and running')
          }
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('Service Worker: Update found, new worker installing...')
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                console.log('Service Worker: New worker state changed to:', newWorker.state)
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('Service Worker: New version installed, prompting user...')
                  if (confirm('A new version is available! Reload to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker: Registration failed with error:', error)
        })

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker: Controller changed, page will reload')
        window.location.reload()
      })
      
      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Service Worker: Message received from SW:', event.data)
      })
    } else {
      console.log('Service Worker: Not supported in this browser')
    }
  }, [])

  return null
} 