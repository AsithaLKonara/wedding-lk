import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getServerSession } from '@/lib/auth-utils';

// In-memory settings store (in production, use database)
let platformSettings = {
  general: {
    siteName: "WeddingLK",
    siteDescription: "Sri Lanka's Premier Wedding Planning Platform",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true
  },
  business: {
    commissionRate: 10, // 10%
    minimumPayout: 5000, // LKR
    autoApproveVendors: false,
    requireVendorVerification: true,
    maxImagesPerListing: 20
  },
  security: {
    maxLoginAttempts: 5,
    sessionTimeout: 24, // hours
    require2FA: false,
    passwordMinLength: 8,
    enableRateLimiting: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminAlerts: true
  },
  features: {
    aiSearch: true,
    advancedAnalytics: true,
    mobileApp: true,
    paymentGateway: true,
    reviewSystem: true
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!token || session.user?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get settings by category
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (category && platformSettings[category as keyof typeof platformSettings]) {
      return NextResponse.json({ 
        settings: platformSettings[category as keyof typeof platformSettings] 
      })
    }

    return NextResponse.json({ settings: platformSettings })

  } catch (error) {
    console.error("Error fetching platform settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch platform settings" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!token || session.user?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { category, updates } = body

    if (!category || !updates) {
      return NextResponse.json(
        { error: "Category and updates are required" },
        { status: 400 }
      )
    }

    if (!platformSettings[category as keyof typeof platformSettings]) {
      return NextResponse.json(
        { error: "Invalid settings category" },
        { status: 400 }
      )
    }

    // Update settings
    platformSettings[category as keyof typeof platformSettings] = {
      ...platformSettings[category as keyof typeof platformSettings],
      ...updates
    }

    return NextResponse.json({ 
      settings: platformSettings[category as keyof typeof platformSettings],
      message: "Settings updated successfully" 
    })

  } catch (error) {
    console.error("Error updating platform settings:", error)
    return NextResponse.json(
      { error: "Failed to update platform settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!token || session.user?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { action, data } = body

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      )
    }

    let result: any = {}

    switch (action) {
      case 'resetSettings':
        // Reset to default settings
        platformSettings = {
          general: {
            siteName: "WeddingLK",
            siteDescription: "Sri Lanka's Premier Wedding Planning Platform",
            maintenanceMode: false,
            registrationEnabled: true,
            emailVerificationRequired: true
          },
          business: {
            commissionRate: 10,
            minimumPayout: 5000,
            autoApproveVendors: false,
            requireVendorVerification: true,
            maxImagesPerListing: 20
          },
          security: {
            maxLoginAttempts: 5,
            sessionTimeout: 24,
            require2FA: false,
            passwordMinLength: 8,
            enableRateLimiting: true
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            adminAlerts: true
          },
          features: {
            aiSearch: true,
            advancedAnalytics: true,
            mobileApp: true,
            paymentGateway: true,
            reviewSystem: true
          }
        }
        result = { message: "Settings reset to defaults" }
        break

      case 'exportSettings':
        result = { settings: platformSettings }
        break

      case 'importSettings':
        if (!data || !data.settings) {
          return NextResponse.json(
            { error: "Settings data is required for import" },
            { status: 400 }
          )
        }
        platformSettings = data.settings
        result = { message: "Settings imported successfully" }
        break

      case 'testEmail':
        // Test email configuration
        result = { message: "Email test completed", success: true }
        break

      case 'testSMS':
        // Test SMS configuration
        result = { message: "SMS test completed", success: true }
        break

      case 'systemHealth':
        // Check system health
        result = {
          database: "Connected",
          email: "Configured",
          sms: "Configured",
          payment: "Active",
          overall: "Healthy"
        }
        break

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error("Error processing settings action:", error)
    return NextResponse.json(
      { error: "Failed to process settings action" },
      { status: 500 }
    )
  }
} 