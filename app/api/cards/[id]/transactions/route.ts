import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const API_BASE_URL = "https://app.zeroid.cc/api/b2b"
const API_KEY = "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI"

function generateMockTransactions(cardId: string, count = 10) {
  const types = ["debit", "credit"] as const
  const descriptions = [
    "Online Purchase",
    "ATM Withdrawal",
    "Refund",
    "Payment Received",
    "Subscription",
    "Transfer",
    "Restaurant",
    "Gas Station",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `txn-${cardId}-${i}`,
    cardId,
    amount: Math.floor(Math.random() * 500) + 10,
    currency: "USD",
    type: types[Math.floor(Math.random() * types.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

// GET /api/cards/[id]/transactions - Get card transactions
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    if (!params.id.startsWith("demo-card-")) {
      const { data: cardOwnership, error: ownershipError } = await supabase
        .from("cards")
        .select("id")
        .eq("zeroid_card_id", params.id)
        .eq("user_id", user.id)
        .single()

      if (ownershipError || !cardOwnership) {
        console.error("[v0] Card ownership verification failed:", ownershipError)
        return NextResponse.json({ error: "Card not found or access denied" }, { status: 403 })
      }
    }

    if (params.id.startsWith("demo-card-")) {
      console.log("[v0] Demo mode: Returning mock transactions for", params.id)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

      const mockTransactions = generateMockTransactions(params.id)
      return NextResponse.json(mockTransactions)
    }

    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()

    const response = await fetch(
      `${API_BASE_URL}/cards/${params.id}/transactions${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      let errorMessage = "Failed to fetch transactions"

      if (contentType?.includes("application/json")) {
        try {
          const error = await response.json()
          errorMessage = error.message || error.detail || errorMessage
        } catch (e) {
          console.error("[v0] Failed to parse error response as JSON:", e)
        }
      } else {
        // Response is not JSON, read as text
        try {
          const errorText = await response.text()
          console.error("[v0] ZeroID API error (text):", errorText)
          errorMessage = errorText || errorMessage
        } catch (e) {
          console.error("[v0] Failed to read error response:", e)
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
