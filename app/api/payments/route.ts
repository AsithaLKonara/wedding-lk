import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, amount, currency, paymentMethod, metadata } = body

    // Process different payment types
    let response
    switch (type) {
      case "subscription":
        response = await processSubscriptionPayment(body)
        break
      case "commission":
        response = await processCommissionPayment(body)
        break
      case "booking":
        response = await processBookingPayment(body)
        break
      case "premium":
        response = await processPremiumPayment(body)
        break
      default:
        throw new Error("Invalid payment type")
    }

    return NextResponse.json({
      success: true,
      data: response,
      message: "Payment processed successfully",
    })
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Payment processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function processSubscriptionPayment(data: any) {
  // Integrate with local payment gateways
  const { plan, vendorId, paymentMethod } = data

  // Mock payment processing - replace with actual gateway integration
  const paymentResponse = await mockPaymentGateway({
    amount: plan.price,
    currency: "LKR",
    method: paymentMethod, // ezCash, mCash, card, bank
    description: `Wedding.lk ${plan.name} Subscription`,
  })

  return {
    paymentId: paymentResponse.id,
    status: "completed",
    subscriptionId: `sub_${Date.now()}`,
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }
}

async function processCommissionPayment(data: any) {
  const { bookingId, vendorId, amount, location } = data

  // Location-based commission rates
  const commissionRates = {
    Colombo: 0.18,
    Gampaha: 0.16,
    Kandy: 0.15,
    Galle: 0.15,
    default: 0.12,
  }

  const rate = commissionRates[location as keyof typeof commissionRates] || commissionRates.default
  const commissionAmount = amount * rate

  return {
    commissionAmount,
    rate,
    vendorAmount: amount - commissionAmount,
    status: "pending_vendor_payout",
  }
}

async function processBookingPayment(data: any) {
  const { venueId, packageId, amount, installments } = data

  if (installments) {
    // Process installment payment
    const installmentAmount = amount / installments
    return {
      type: "installment",
      totalAmount: amount,
      installmentAmount,
      installmentsRemaining: installments - 1,
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  }

  return {
    type: "full_payment",
    amount,
    status: "completed",
    bookingConfirmed: true,
  }
}

async function processPremiumPayment(data: any) {
  const { userId, plan, duration } = data

  return {
    premiumUntil: new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000),
    features: plan.features,
    status: "active",
  }
}

// Mock payment gateway - replace with actual Sri Lankan payment gateways
async function mockPaymentGateway(data: any) {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: `pay_${Date.now()}`,
    status: "completed",
    amount: data.amount,
    currency: data.currency,
    method: data.method,
  }
}
