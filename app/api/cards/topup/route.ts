import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

const API_BASE_URL = "https://app.zeroid.cc/api/b2b"
const API_KEY = "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, amount } = body

    console.log("[v0] Credit-based top-up request:", { cardId, amount })

    if (amount < 30 || amount % 30 !== 0) {
      return NextResponse.json({ error: "Amount must be a multiple of $30 (minimum $30)" }, { status: 400 })
    }

    const supabase = await createClient()
    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Authentication failed:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const creditsNeeded = Math.ceil(amount / 30)
    console.log("[v0] Credits needed:", creditsNeeded)

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Failed to fetch user profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    const currentCredits = profile.credits || 0
    console.log("[v0] User credits:", currentCredits)

    if (currentCredits < creditsNeeded) {
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${creditsNeeded} credits but only have ${currentCredits}.`,
        },
        { status: 400 },
      )
    }

    const { data: updateData, error: updateError } = await supabase
      .from("profiles")
      .update({ credits: currentCredits - creditsNeeded })
      .eq("id", user.id)
      .eq("credits", currentCredits)
      .select()

    if (updateError || !updateData || updateData.length === 0) {
      console.error("[v0] Failed to deduct credits:", updateError)
      return NextResponse.json({ error: "Failed to deduct credits. Please try again." }, { status: 500 })
    }

    console.log("[v0] Credits deducted successfully. New balance:", currentCredits - creditsNeeded)

    try {
      const response = await fetch(`${API_BASE_URL}/cards/${cardId}/topup`, {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount.toFixed(2)),
          currency_id: "usdc",
        }),
      })

      const responseText = await response.text()
      console.log("[v0] ZeroID API response:", response.status, responseText)

      if (!response.ok) {
        console.error("[v0] ZeroID API failed, refunding credits")
        await supabase.from("profiles").update({ credits: currentCredits }).eq("id", user.id)

        await supabaseAdmin.from("credit_transactions").insert({
          user_id: user.id,
          amount: creditsNeeded,
          type: "refund",
          description: JSON.stringify({
            reason: "card_topup_failed",
            cardId,
            amount,
            error: responseText,
          }),
        })

        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { message: "Failed to top up card" }
        }

        let errorMessage = errorData.detail || errorData.message || "Failed to top up card"

        if (errorMessage.includes("Insufficient balance") || errorMessage.includes("balance too low")) {
          errorMessage =
            "Service temporarily unavailable. The card service is being refunded. Your credits have been refunded. Please try again later or contact support."
        }

        return NextResponse.json({ error: errorMessage }, { status: response.status })
      }

      const data = JSON.parse(responseText)
      console.log("[v0] Top-up successful:", data)

      await supabaseAdmin.from("credit_transactions").insert({
        user_id: user.id,
        amount: -creditsNeeded,
        type: "purchase",
        description: JSON.stringify({
          cardId,
          amount,
          currency: "usdc",
          reference_id: data.reference_id,
        }),
      })

      return NextResponse.json({
        success: true,
        message: `Successfully added $${amount} to your card`,
        creditsDeducted: creditsNeeded,
        remainingCredits: currentCredits - creditsNeeded,
        zeroidResponse: data,
      })
    } catch (zeroidError) {
      console.error("[v0] ZeroID API error, refunding credits:", zeroidError)
      await supabase.from("profiles").update({ credits: currentCredits }).eq("id", user.id)

      await supabaseAdmin.from("credit_transactions").insert({
        user_id: user.id,
        amount: creditsNeeded,
        type: "refund",
        description: JSON.stringify({
          reason: "card_topup_error",
          cardId,
          amount,
          error: zeroidError instanceof Error ? zeroidError.message : "Unknown error",
        }),
      })

      throw zeroidError
    }
  } catch (error) {
    console.error("[v0] Error in top-up:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to top up card" },
      { status: 500 },
    )
  }
}
