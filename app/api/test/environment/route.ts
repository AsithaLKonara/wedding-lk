import { NextResponse } from "next/server"

export async function GET() {
  try {
    const requiredEnvVars = [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "MONGODB_URI",
      "NEXTAUTH_SECRET",
      "NEXTAUTH_URL",
    ]

    const envStatus = requiredEnvVars.map((varName) => ({
      name: varName,
      configured: !!process.env[varName],
      value: process.env[varName] ? "***configured***" : "missing",
    }))

    const allConfigured = envStatus.every((env) => env.configured)

    return NextResponse.json({
      success: allConfigured,
      message: allConfigured ? "All environment variables configured" : "Some environment variables missing",
      variables: envStatus,
      totalRequired: requiredEnvVars.length,
      configured: envStatus.filter((env) => env.configured).length,
    })
  } catch (error) {
    console.error("Environment test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Environment test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
