import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import bcrypt from "bcryptjs"
import { Vendor } from "@/lib/models/vendor"
import crypto from "crypto"
import { sendMail } from "@/lib/utils/mail"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { firstName, lastName, email, phone, password, userType, weddingDate,
      businessName, category, businessAddress, businessCity, businessProvince, businessPhone, businessEmail, website, businessDescription } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !userType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await (User as any).findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      userType,
      weddingDate: weddingDate ? new Date(weddingDate) : undefined,
      isVerified: false,
      verificationToken,
      subscription: {
        plan: "free",
        expiresAt: null,
      },
    })

    await user.save()

    let vendor = null
    if (userType === "vendor") {
      // Create vendor entry
      vendor = new Vendor({
        name: `${firstName} ${lastName}`,
        businessName,
        category,
        description: businessDescription,
        location: {
          address: businessAddress,
          city: businessCity,
          province: businessProvince,
        },
        contact: {
          phone: businessPhone,
          email: businessEmail,
          website,
        },
        owner: user._id,
        pricing: { startingPrice: 0 }, // Default, can be updated later
      })
      await vendor.save()
    }

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`
    await sendMail({
      to: email,
      subject: "Verify your Wedding.lk account",
      html: `<p>Welcome to Wedding.lk!</p><p>Please <a href="${verifyUrl}">verify your email</a> to activate your account.</p>`
    })

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject()

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: userResponse,
        ...(vendor && { vendor: vendor.toObject() }),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Registration failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
