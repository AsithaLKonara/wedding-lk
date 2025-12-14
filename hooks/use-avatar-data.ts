import { useState, useEffect, useCallback } from 'react'
import { UserAvatarService, UserAvatarData, VendorAvatarData, VenueAvatarData } from '@/lib/services/user-avatar-service'

interface UseAvatarDataReturn {
  loading: boolean
  error: string | null
  refresh: () => void
}

interface UseUserAvatarReturn extends UseAvatarDataReturn {
  user: UserAvatarData | null
}

interface UseVendorsWithAvatarsReturn extends UseAvatarDataReturn {
  vendors: VendorAvatarData[]
  total: number
}

interface UseVenuesWithAvatarsReturn extends UseAvatarDataReturn {
  venues: VenueAvatarData[]
  total: number
}

/**
 * Hook to fetch user avatar data by ID
 */
export function useUserAvatar(userId: string): UseUserAvatarReturn {
  const [user, setUser] = useState<UserAvatarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      setError(null)
      const userData = await UserAvatarService.getUserById(userId)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const refresh = useCallback(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { user, loading, error, refresh }
}

/**
 * Hook to fetch user avatar data by email
 */
export function useUserAvatarByEmail(email: string): UseUserAvatarReturn {
  const [user, setUser] = useState<UserAvatarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    if (!email) return
    
    try {
      setLoading(true)
      setError(null)
      const userData = await UserAvatarService.getUserByEmail(email)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }, [email])

  const refresh = useCallback(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { user, loading, error, refresh }
}

/**
 * Hook to fetch vendors with owner avatar data
 */
export function useVendorsWithAvatars(limit: number = 50): UseVendorsWithAvatarsReturn {
  const [vendors, setVendors] = useState<VendorAvatarData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const vendorsData = await UserAvatarService.getAllVendorsWithOwners()
      setVendors(vendorsData.slice(0, limit))
      setTotal(vendorsData.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors')
    } finally {
      setLoading(false)
    }
  }, [limit])

  const refresh = useCallback(() => {
    fetchVendors()
  }, [fetchVendors])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  return { vendors, total, loading, error, refresh }
}

/**
 * Hook to fetch venues with avatar data
 */
export function useVenuesWithAvatars(limit: number = 50): UseVenuesWithAvatarsReturn {
  const [venues, setVenues] = useState<VenueAvatarData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const venuesData = await UserAvatarService.getAllVenues()
      setVenues(venuesData.slice(0, limit))
      setTotal(venuesData.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch venues')
    } finally {
      setLoading(false)
    }
  }, [limit])

  const refresh = useCallback(() => {
    fetchVenues()
  }, [fetchVenues])

  useEffect(() => {
    fetchVenues()
  }, [fetchVenues])

  return { venues, total, loading, error, refresh }
}

/**
 * Hook to fetch multiple users by IDs
 */
export function useUsersByIds(userIds: string[]): UseAvatarDataReturn & { users: UserAvatarData[] } {
  const [users, setUsers] = useState<UserAvatarData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    if (!userIds.length) {
      setUsers([])
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      const usersData = await UserAvatarService.getUsersByIds(userIds)
      setUsers(usersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [userIds])

  const refresh = useCallback(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, refresh }
} 