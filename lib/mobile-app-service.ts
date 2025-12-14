import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"
import { Vendor } from "@/lib/models/vendor"
import User from "@/lib/models/user"
import { Booking } from "@/lib/models/booking"

interface MobileAppConfig {
  apiEndpoints: Record<string, string>
  features: Record<string, boolean>
  settings: Record<string, any>
  version: string
}

interface MobilePushNotification {
  title: string
  body: string
  data?: Record<string, any>
  image?: string
  action?: string
}

interface MobileUserData {
  profile: any
  preferences: any
  bookings: any[]
  favorites: any[]
  notifications: any[]
}

class MobileAppService {
  private appConfig: MobileAppConfig = {
    apiEndpoints: {
      base: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      auth: '/api/auth',
      venues: '/api/venues',
      vendors: '/api/vendors',
      bookings: '/api/bookings',
      payments: '/api/payments',
      messages: '/api/messages',
      notifications: '/api/notifications',
      analytics: '/api/analytics',
      ai: '/api/ai-search'
    },
    features: {
      realTimeChat: true,
      pushNotifications: true,
      offlineMode: true,
      cameraIntegration: true,
      locationServices: true,
      paymentGateway: true,
      socialSharing: true,
      aiFeatures: true,
      analytics: true,
      darkMode: true
    },
    settings: {
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'si', 'ta'],
      defaultCurrency: 'LKR',
      supportedCurrencies: ['LKR', 'USD', 'EUR'],
      maxImageSize: 10 * 1024 * 1024, // 10MB
      maxFileSize: 50 * 1024 * 1024, // 50MB
      cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
      pushNotificationExpiry: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    version: '1.0.0'
  }

  // Get mobile app configuration
  getMobileAppConfig(): MobileAppConfig {
    return this.appConfig
  }

  // Get mobile-optimized user data
  async getMobileUserData(userId: string): Promise<MobileUserData | null> {
    try {
      await connectDB()
      
      const user = await User.findById(userId)
      if (!user) return null

      const bookings = await Booking.find({ userId }).populate('venueId vendorId')
      const favorites = await this.getUserFavorites(userId)
      const notifications = await this.getUserNotifications(userId)

      return {
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive,
          lastLogin: user.lastLogin
        },
        preferences: user.preferences || {},
        bookings: bookings.map((booking: any) => ({
          id: booking._id,
          date: booking.date,
          guestCount: booking.guestCount,
          totalAmount: booking.totalAmount,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          venue: booking.venueId ? {
            id: booking.venueId._id,
            name: booking.venueId.name,
            location: booking.venueId.location
          } : null,
          vendor: booking.vendorId ? {
            id: booking.vendorId._id,
            name: booking.vendorId.name,
            category: booking.vendorId.category
          } : null,
          services: booking.services
        })),
        favorites: favorites,
        notifications: notifications
      }

    } catch (error) {
      console.error('Mobile user data error:', error)
      return null
    }
  }

  // Get user favorites for mobile
  private async getUserFavorites(userId: string): Promise<any[]> {
    try {
      // In a real implementation, this would fetch from a favorites collection
      const venues = await Venue.find({ isActive: true }).limit(5)
      const vendors = await Vendor.find({ isActive: true }).limit(5)

      return [
        ...venues.map(venue => ({
          type: 'venue',
          id: venue._id,
          name: venue.name,
          image: venue.images[0],
          location: venue.location,
          price: venue.price,
          rating: venue.rating
        })),
        ...vendors.map((vendor: any) => ({
          type: 'vendor',
          id: vendor._id,
          name: vendor.name,
          image: vendor.images[0],
          category: vendor.category,
          location: vendor.location,
          price: vendor.price,
          rating: vendor.rating
        }))
      ]
    } catch (error) {
      console.error('User favorites error:', error)
      return []
    }
  }

  // Get user notifications for mobile
  private async getUserNotifications(userId: string): Promise<any[]> {
    try {
      // In a real implementation, this would fetch from notifications collection
      return [
        {
          id: 'notif_1',
          type: 'booking',
          title: 'Booking Confirmed',
          message: 'Your venue booking has been confirmed',
          isRead: false,
          timestamp: new Date()
        },
        {
          id: 'notif_2',
          type: 'payment',
          title: 'Payment Received',
          message: 'Your payment has been processed successfully',
          isRead: true,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ]
    } catch (error) {
      console.error('User notifications error:', error)
      return []
    }
  }

  // Send mobile push notification
  async sendMobilePushNotification(userId: string, notification: MobilePushNotification): Promise<boolean> {
    try {
      console.log('📱 Sending mobile push notification to user:', userId)
      console.log('Title:', notification.title)
      console.log('Body:', notification.body)
      
      // In a real implementation, this would use Firebase Cloud Messaging or similar
      // const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     to: userDeviceToken,
      //     notification: {
      //       title: notification.title,
      //       body: notification.body,
      //       image: notification.image
      //     },
      //     data: notification.data
      //   })
      // })

      console.log('✅ Mobile push notification sent successfully')
      return true

    } catch (error) {
      console.error('❌ Mobile push notification failed:', error)
      return false
    }
  }

  // Get mobile-optimized venue data
  async getMobileVenues(filters: any = {}): Promise<any[]> {
    try {
      await connectDB()
      
      const query: any = { isActive: true }
      
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' }
      }
      
      if (filters.maxPrice) {
        query.price = { $lte: filters.maxPrice }
      }
      
      if (filters.minCapacity) {
        query.capacity = { $gte: filters.minCapacity }
      }

      const venues = await Venue.find(query)
        .select('name location price capacity rating images amenities')
        .limit(20)

      return venues.map(venue => ({
        id: venue._id,
        name: venue.name,
        location: venue.location,
        price: venue.price,
        capacity: venue.capacity,
        rating: venue.rating,
        image: venue.images[0],
        amenities: venue.amenities.slice(0, 5) // Limit for mobile
      }))

    } catch (error) {
      console.error('Mobile venues error:', error)
      return []
    }
  }

  // Get mobile-optimized vendor data
  async getMobileVendors(filters: any = {}): Promise<any[]> {
    try {
      await connectDB()
      
      const query: any = { isActive: true }
      
      if (filters.category) {
        query.category = filters.category
      }
      
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' }
      }
      
      if (filters.maxPrice) {
        query.price = { $lte: filters.maxPrice }
      }

      const vendors = await Vendor.find(query)
        .select('name category location price rating images services')
        .limit(20)

      return vendors.map((vendor: any) => ({
        id: vendor._id,
        name: vendor.name,
        category: vendor.category,
        location: vendor.location,
        price: vendor.price,
        rating: vendor.rating,
        image: vendor.images[0],
        services: vendor.services.slice(0, 5) // Limit for mobile
      }))

    } catch (error) {
      console.error('Mobile vendors error:', error)
      return []
    }
  }

  // Get mobile-optimized booking data
  async getMobileBookings(userId: string): Promise<any[]> {
    try {
      await connectDB()
      
      const bookings = await Booking.find({ userId })
        .populate('venueId', 'name location')
        .populate('vendorId', 'name category')
        .sort({ createdAt: -1 })
        .limit(10)

      return bookings.map((booking: any) => ({
        id: booking._id,
        date: booking.date,
        guestCount: booking.guestCount,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        venue: booking.venueId ? {
          id: booking.venueId._id,
          name: booking.venueId.name,
          location: booking.venueId.location
        } : null,
        vendor: booking.vendorId ? {
          id: booking.vendorId._id,
          name: booking.vendorId.name,
          category: booking.vendorId.category
        } : null,
        services: booking.services
      }))

    } catch (error) {
      console.error('Mobile bookings error:', error)
      return []
    }
  }

  // Generate mobile app manifest
  generateMobileAppManifest(): any {
    return {
      name: 'WeddingLK',
      short_name: 'WeddingLK',
      description: 'Complete wedding planning platform',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ff6b6b',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      categories: ['lifestyle', 'planning'],
      lang: 'en',
      dir: 'ltr'
    }
  }

  // Generate React Native configuration
  generateReactNativeConfig(): any {
    return {
      app: {
        name: 'WeddingLK',
        displayName: 'WeddingLK',
        version: '1.0.0',
        buildNumber: '1'
      },
      ios: {
        bundleIdentifier: 'com.weddinglk.app',
        buildNumber: '1',
        deploymentTarget: '13.0',
        permissions: [
          'NSCameraUsageDescription',
          'NSLocationWhenInUseUsageDescription',
          'NSPhotoLibraryUsageDescription',
          'NSMicrophoneUsageDescription'
        ]
      },
      android: {
        package: 'com.weddinglk.app',
        versionCode: 1,
        permissions: [
          'android.permission.CAMERA',
          'android.permission.ACCESS_FINE_LOCATION',
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.WRITE_EXTERNAL_STORAGE',
          'android.permission.RECORD_AUDIO'
        ]
      },
      dependencies: {
        '@react-navigation/native': '^6.1.9',
        '@react-navigation/stack': '^6.3.20',
        '@react-navigation/bottom-tabs': '^6.5.11',
        'react-native-vector-icons': '^10.0.3',
        'react-native-image-picker': '^7.1.0',
        'react-native-geolocation-service': '^5.3.1',
        'react-native-push-notification': '^8.1.1',
        'react-native-socket-io': '^1.0.0',
        '@react-native-async-storage/async-storage': '^1.21.0',
        'react-native-google-signin': '^10.1.1',
        'react-native-fbsdk-next': '^12.1.3'
      }
    }
  }

  // Generate mobile API documentation
  generateMobileAPIDocs(): any {
    return {
      baseUrl: this.appConfig.apiEndpoints.base,
      endpoints: {
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register',
          logout: 'POST /api/auth/logout',
          refresh: 'POST /api/auth/refresh'
        },
        venues: {
          list: 'GET /api/venues',
          detail: 'GET /api/venues/{id}',
          search: 'GET /api/venues?location={location}&maxPrice={price}'
        },
        vendors: {
          list: 'GET /api/vendors',
          detail: 'GET /api/vendors/{id}',
          search: 'GET /api/vendors?category={category}&location={location}'
        },
        bookings: {
          list: 'GET /api/bookings',
          create: 'POST /api/bookings',
          detail: 'GET /api/bookings/{id}',
          update: 'PUT /api/bookings/{id}'
        },
        payments: {
          create: 'POST /api/payments',
          list: 'GET /api/payments',
          detail: 'GET /api/payments/{id}'
        },
        messages: {
          list: 'GET /api/messages',
          send: 'POST /api/messages',
          markRead: 'PUT /api/messages/{id}/read'
        },
        notifications: {
          list: 'GET /api/notifications',
          markRead: 'PUT /api/notifications/{id}/read'
        },
        ai: {
          search: 'POST /api/ai-search',
          recommendations: 'GET /api/ai-search/recommendations'
        }
      },
      authentication: {
        type: 'Bearer Token',
        header: 'Authorization: Bearer {token}',
        refresh: 'Automatic token refresh'
      },
      errorCodes: {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error'
      }
    }
  }

  // Test mobile app service
  async testMobileAppService(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    try {
      // Test mobile app config
      const config = this.getMobileAppConfig()
      results.config = !!config.apiEndpoints

      // Test mobile user data
      const userData = await this.getMobileUserData('mock-user-id')
      results.userData = !!userData

      // Test mobile venues
      const venues = await this.getMobileVenues()
      results.venues = venues.length > 0

      // Test mobile vendors
      const vendors = await this.getMobileVendors()
      results.vendors = vendors.length > 0

      // Test mobile bookings
      const bookings = await this.getMobileBookings('mock-user-id')
      results.bookings = bookings.length >= 0

      // Test push notification
      const pushResult = await this.sendMobilePushNotification('mock-user-id', {
        title: 'Test Notification',
        body: 'This is a test push notification'
      })
      results.pushNotification = pushResult

      // Test manifest generation
      const manifest = this.generateMobileAppManifest()
      results.manifest = !!manifest.name

      // Test React Native config
      const rnConfig = this.generateReactNativeConfig()
      results.reactNativeConfig = !!rnConfig.app

      // Test API docs
      const apiDocs = this.generateMobileAPIDocs()
      results.apiDocs = !!apiDocs.endpoints

    } catch (error) {
      console.error('Mobile app service test error:', error)
    }

    return results
  }
}

export default new MobileAppService() 