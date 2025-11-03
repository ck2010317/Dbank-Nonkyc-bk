import { type NextRequest, NextResponse } from "next/server"
import { createPayment } from "@/lib/nowpayments"
import { addDepositRequest } from "@/lib/user-balance"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, currency } = body
    const userId = user.id

    console.log("[v0] Creating payment for user:", { userId, amount, currency })

    // Map currency to NOWPayments format
    const currencyMap: Record<string, string> = {
      usdt: "usdttrc20", // TRC20 USDT (Tron network - lower fees)
      usdc: "usdcerc20", // ERC20 USDC
    }

    const payCurrency = currencyMap[currency.toLowerCase()] || currency

    // Create unique order ID
    const orderId = `${userId}-${Date.now()}`

    // Create payment via NOWPayments
    const payment = await createPayment({
      price_amount: amount,
      price_currency: "usd",
      pay_currency: payCurrency,
      order_id: orderId,
      order_description: `dbank account top-up - ${amount} ${currency.toUpperCase()}`,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payment/webhook`,
    })

    // Store deposit request with payment info
    await addDepositRequest(userId, {
      currency: currency.toUpperCase(),
      amount,
      transactionHash: payment.payment_id,
      status: "pending",
      paymentAddress: payment.pay_address,
      paymentId: payment.payment_id,
    })

    console.log("[v0] Payment created successfully:", payment.payment_id)

    return NextResponse.json({
      success: true,
      payment: {
        paymentId: payment.payment_id,
        depositAddress: payment.pay_address,
        amount: payment.pay_amount,
        currency: payment.pay_currency,
        status: payment.payment_status,
      },
    })
  } catch (error: any) {
    console.error("[v0] Payment creation error:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to create payment" }, { status: 500 })
  }
}
