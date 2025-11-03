import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI"

// These should be set in your Vercel project settings or .env file
const PAYMENT_CONFIG = {
  crypto: {
    usdt_address: process.env.USDT_DEPOSIT_ADDRESS || "0xeAd07a01AD220AD359680E77C227535E9811Fd24",
    usdc_address: process.env.USDC_DEPOSIT_ADDRESS || "0xeAd07a01AD220AD359680E77C227535E9811Fd24",
    btc_address: process.env.BTC_DEPOSIT_ADDRESS || "",
  },
  bank: {
    bank_name: process.env.BANK_NAME || "",
    account_number: process.env.BANK_ACCOUNT_NUMBER || "",
    routing_number: process.env.BANK_ROUTING_NUMBER || "",
  },
  stripe: {
    enabled: process.env.STRIPE_SECRET_KEY ? true : false,
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Account top-up request:", body)

    const { amount, currency_id, payment_method } = body

    // Validate input
    if (!amount || amount < 10) {
      return NextResponse.json({ error: "Minimum top-up amount is $10" }, { status: 400 })
    }

    if (!currency_id) {
      return NextResponse.json({ error: "Currency is required" }, { status: 400 })
    }

    if (payment_method === "crypto") {
      const address = getCryptoAddress(currency_id)
      if (!address) {
        return NextResponse.json(
          {
            error: "Crypto payments not configured. Please contact support or use another payment method.",
          },
          { status: 400 },
        )
      }
    } else if (payment_method === "bank" && !PAYMENT_CONFIG.bank.account_number) {
      return NextResponse.json(
        {
          error: "Bank transfers not configured. Please contact support or use another payment method.",
        },
        { status: 400 },
      )
    } else if (payment_method === "stripe" && !PAYMENT_CONFIG.stripe.enabled) {
      return NextResponse.json(
        {
          error: "Card payments not configured. Please contact support or use another payment method.",
        },
        { status: 400 },
      )
    }

    // Create a top-up request record
    // In a real implementation, you would:
    // 1. Store this in your database
    // 2. Generate a payment link (Stripe, crypto payment processor, etc.)
    // 3. Track the payment status
    // 4. Once payment is confirmed, credit the ZeroID account

    const topupRequest = {
      id: `topup_${Date.now()}`,
      amount,
      currency_id,
      payment_method,
      status: "pending",
      created_at: new Date().toISOString(),
      // Payment instructions based on method
      payment_instructions: getPaymentInstructions(payment_method, currency_id, amount),
    }

    console.log("[v0] Top-up request created:", topupRequest)

    return NextResponse.json({
      success: true,
      topup_request: topupRequest,
      message: "Top-up request created. Please complete the payment.",
    })
  } catch (error) {
    console.error("[v0] Account top-up error:", error)
    return NextResponse.json({ error: "Failed to create top-up request" }, { status: 500 })
  }
}

function getPaymentInstructions(method: string, currency: string, amount: number) {
  // Generate payment instructions based on the payment method
  if (method === "crypto") {
    const address = getCryptoAddress(currency)
    return {
      type: "crypto",
      currency: currency.toUpperCase(),
      address: address || "NOT_CONFIGURED",
      amount,
      note: address
        ? "Send exactly the specified amount to the address above. Your account will be credited within 10 minutes after confirmation."
        : "⚠️ Crypto deposit address not configured. Please contact support.",
    }
  } else if (method === "bank") {
    return {
      type: "bank_transfer",
      bank_name: PAYMENT_CONFIG.bank.bank_name || "NOT_CONFIGURED",
      account_number: PAYMENT_CONFIG.bank.account_number || "NOT_CONFIGURED",
      routing_number: PAYMENT_CONFIG.bank.routing_number || "NOT_CONFIGURED",
      amount,
      reference: `TOPUP_${Date.now()}`,
      note: PAYMENT_CONFIG.bank.account_number
        ? "Include the reference number in your transfer. Processing takes 1-3 business days."
        : "⚠️ Bank transfer details not configured. Please contact support.",
    }
  } else if (method === "stripe") {
    return {
      type: "card_payment",
      note: PAYMENT_CONFIG.stripe.enabled
        ? "You will be redirected to Stripe to complete your payment."
        : "⚠️ Card payments not configured. Please contact support.",
      // In a real implementation, create a Stripe checkout session here
      checkout_url: PAYMENT_CONFIG.stripe.enabled ? "#" : "",
    }
  }

  return {
    type: "manual",
    note: "Please contact support to complete your top-up.",
  }
}

function getCryptoAddress(currency: string): string {
  const addresses: Record<string, string> = {
    usdt: PAYMENT_CONFIG.crypto.usdt_address,
    usdc: PAYMENT_CONFIG.crypto.usdc_address,
    btc: PAYMENT_CONFIG.crypto.btc_address,
  }
  return addresses[currency.toLowerCase()] || ""
}

export async function GET(request: NextRequest) {
  try {
    // Get pending top-up requests
    // In a real implementation, fetch from your database
    console.log("[v0] Fetching top-up requests")

    return NextResponse.json({
      success: true,
      requests: [],
      message: "No pending top-up requests",
    })
  } catch (error) {
    console.error("[v0] Error fetching top-up requests:", error)
    return NextResponse.json({ error: "Failed to fetch top-up requests" }, { status: 500 })
  }
}
