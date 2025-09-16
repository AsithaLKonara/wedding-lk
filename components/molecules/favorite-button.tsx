"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FavoriteButtonProps {
  itemId: string
  itemType: 'vendor' | 'venue' | 'package'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function FavoriteButton({ 
  itemId, 
  itemType, 
  className = '', 
  size = 'md',
  showText = false 
}: FavoriteButtonProps) {
  const { data: session } = useSession()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (session?.user) {
      checkFavoriteStatus()
    } else {
      setIsChecking(false)
    }
  }, [session, itemId, itemType])

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites?itemId=${itemId}&itemType=${itemType}`)
      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data.isFavorited)
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/signin'
      return
    }

    setIsLoading(true)

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?itemId=${itemId}&itemType=${itemType}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setIsFavorited(false)
        } else {
          throw new Error('Failed to remove favorite')
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemId,
            itemType
          })
        })
        
        if (response.ok) {
          setIsFavorited(true)
        } else {
          throw new Error('Failed to add favorite')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8'
      case 'lg':
        return 'h-12 w-12'
      default:
        return 'h-10 w-10'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-6 h-6'
      default:
        return 'w-5 h-5'
    }
  }

  if (isChecking) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`${getSizeClasses()} ${className}`}
        disabled
      >
        <Heart className={`${getIconSize()} text-gray-400`} />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${getSizeClasses()} ${className} ${
        isFavorited 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      }`}
    >
      <Heart 
        className={`${getIconSize()} ${
          isFavorited ? 'fill-current' : ''
        }`} 
      />
      {showText && (
        <span className="ml-2">
          {isFavorited ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  )
}
