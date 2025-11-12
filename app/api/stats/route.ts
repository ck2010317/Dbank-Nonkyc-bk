import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET() {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createServerClient(supabaseUrl!, supabaseServiceKey, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })

    console.log("[v0] Fetching platform-wide stats with service role...")

    // Get total cards created
    const { count: totalCards, error: cardsError } = await supabase
      .from("cards")
      .select("*", { count: "exact", head: true })

    console.log("[v0] Cards count:", totalCards, "Error:", cardsError)

    // Get all purchase transactions to calculate deposits
    const { data: transactions, error: transactionsError } = await supabase
      .from("credit_transactions")
      .select("amount, type")
      .eq("type", "purchase")

    console.log("[v0] Transactions:", transactions?.length, "rows", "Error:", transactionsError)

    const totalCreditsDeposited =
      transactions?.reduce((sum, tx) => {
        return sum + Math.abs(tx.amount || 0)
      }, 0) || 0

    const totalDeposits = totalCreditsDeposited * 30

    // Get total active users (profiles)
    const { count: activeUsers, error: usersError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    console.log("[v0] Active users count:", activeUsers, "Error:", usersError)

    const result = {
      totalCards: totalCards || 0,
      totalDeposits: Math.round(totalDeposits * 100) / 100,
      activeUsers: activeUsers || 0,
      totalCredits: 0, // Keep for interface compatibility
    }

    console.log("[v0] Returning stats:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error in stats API:", error)
    return NextResponse.json(
      {
        totalCards: 0,
        totalDeposits: 0,
        activeUsers: 0,
        totalCredits: 0,
      },
      { status: 500 },
    )
  }
}
