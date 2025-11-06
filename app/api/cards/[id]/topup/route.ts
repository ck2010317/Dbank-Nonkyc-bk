import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const API_BASE_URL = "https://app.zeroid.cc/api/b2b"
const API_KEY = "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI"

// POST /api/cards/[id]/topup - Top up card (credit-based)
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

    const body = await request.json()
    const { amount } = body

    if (!amount || amount < 15) {
      return NextResponse.json({ error: "Minimum top-up amount is $15" }, { status: 400 })
    }

    if (amount % 15 !== 0) {
      return NextResponse.json({ error: "Top-up amount must be in increments of $15" }, { status: 400 })
    }

    const creditsNeeded = amount / 15

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Error fetching user profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    if (profile.credits < creditsNeeded) {
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${creditsNeeded} credit(s) to top up $${amount}. You have ${profile.credits} credit(s).`,
        },
        { status: 403 },
      )
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({ credits: profile.credits - creditsNeeded })
      .eq("id", user.id)
      .eq("credits", profile.credits)
      .select()
      .single()

    if (updateError || !updatedProfile) {
      console.error("[v0] Failed to deduct credits:", updateError)
      return NextResponse.json({ error: "Failed to deduct credits. Please try again." }, { status: 409 })
    }

    console.log("[v0] Credits deducted. New balance:", updatedProfile.credits)

    const response = await fetch(`${API_BASE_URL}/cards/${params.id}/topup`, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    })

    if (!response.ok) {
      console.error("[v0] Top-up failed, refunding credits...")
      await supabase
        .from("profiles")
        .update({ credits: updatedProfile.credits + creditsNeeded })
        .eq("id", user.id)

      const error = await response.json().catch(() => ({ message: "Failed to top up card" }))
      return NextResponse.json({ error: error.message || "Failed to top up card" }, { status: response.status })
    }

    const data = await response.json()

    const supabaseAdmin = await createClient()
    await supabaseAdmin.from("credit_transactions").insert({
      user_id: user.id,
      amount: -creditsNeeded,
      type: "purchase",
      description: `Card top-up: $${amount}`,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error topping up card:", error)
    return NextResponse.json({ error: "Failed to top up card" }, { status: 500 })
  }
}
