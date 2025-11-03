import { type NextRequest, NextResponse } from "next/server"
import { getAllUserBalances } from "@/lib/user-balance"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
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

    const userId = user.id
    const balances = getAllUserBalances(userId)

    console.log("[v0] Fetching user balances for:", userId)
    console.log("[v0] User balances:", balances)

    return NextResponse.json({
      success: true,
      balances: balances.map((b) => ({
        currency: b.currency,
        balance: b.balance,
        lastUpdated: b.lastUpdated,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching user balance:", error)
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}
