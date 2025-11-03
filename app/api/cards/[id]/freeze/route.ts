import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const API_BASE_URL = "https://app.zeroid.cc/api/b2b"
const API_KEY = "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI"

// POST /api/cards/[id]/freeze - Freeze card
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify user owns this card
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

    if (params.id.startsWith("demo-card-")) {
      console.log("[v0] Demo mode: Freezing mock card", params.id)
      await new Promise((resolve) => setTimeout(resolve, 500))

      return NextResponse.json({
        success: true,
        message: "Card frozen successfully",
        cardId: params.id,
      })
    }

    const response = await fetch(`${API_BASE_URL}/cards/${params.id}/freeze`, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to freeze card" }))
      return NextResponse.json({ error: error.message || "Failed to freeze card" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error freezing card:", error)
    return NextResponse.json({ error: "Failed to freeze card" }, { status: 500 })
  }
}
