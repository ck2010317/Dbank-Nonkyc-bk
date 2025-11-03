import { type NextRequest, NextResponse } from "next/server"
import { approveDeposit } from "@/lib/user-balance"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Received payment webhook:", body)

    const { payment_id, payment_status, order_id, pay_amount, pay_currency } = body

    // Only process confirmed/finished payments
    if (payment_status === "finished" || payment_status === "confirmed") {
      // Extract userId from order_id (format: userId-timestamp)
      const userId = order_id.split("-")[0]

      console.log("[v0] Payment confirmed, crediting user:", userId)

      // Find and approve the deposit
      await approveDeposit(userId, payment_id, pay_amount)

      console.log("[v0] User balance credited successfully")
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
