import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"

const API_BASE_URL = "https://app.zeroid.cc/api/b2b"
const API_KEY = "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI"

// GET /api/cards - Get user's cards only
export async function GET() {
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

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabaseAdmin = createServerClient(supabaseUrl!, supabaseServiceKey, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })

    const { data: userCards, error: cardsError } = await supabaseAdmin
      .from("cards")
      .select("zeroid_card_id, title")
      .eq("user_id", user.id)

    if (cardsError) {
      console.error("[v0] Error fetching user cards from database:", cardsError)
      return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
    }

    console.log("[v0] User has", userCards?.length || 0, "cards in database")
    console.log(
      "[v0] User's card IDs:",
      userCards?.map((c) => c.zeroid_card_id),
    )

    // Fetch all cards from ZeroID for enrichment
    console.log("[v0] Fetching cards from ZeroID API...")
    const response = await fetch(`${API_BASE_URL}/cards`, {
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] ZeroID API response status:", response.status)

    const responseText = await response.text()

    if (responseText.trim().startsWith("<!DOCTYPE html>") || responseText.includes("<html")) {
      console.error("[v0] ZeroID API returned HTML error page (likely 502/503)")
      return NextResponse.json(
        { error: "ZeroID API is temporarily unavailable. Please try again in a few minutes." },
        { status: 503 },
      )
    }

    let zeroidCards: any[] = []
    if (response.ok) {
      try {
        const data = JSON.parse(responseText)
        zeroidCards = Array.isArray(data) ? data : data.cards || []
        console.log("[v0] ZeroID returned", zeroidCards.length, "total cards")
      } catch (parseError) {
        console.error("[v0] Failed to parse ZeroID response:", parseError)
      }
    }

    const zeroidCardMap = new Map(zeroidCards.map((card) => [card.id, card]))

    const enrichedCards = (userCards || []).map((dbCard) => {
      const zeroidData = zeroidCardMap.get(dbCard.zeroid_card_id)

      if (zeroidData) {
        // Card found in ZeroID - return full data
        return {
          ...zeroidData,
          balance: (zeroidData.spend_cap || 0) - (zeroidData.spent_amount || 0),
        }
      } else {
        // Card not found in ZeroID API response - return basic info from database
        console.log("[v0] Card", dbCard.zeroid_card_id, "not found in ZeroID response, showing basic info")
        return {
          id: dbCard.zeroid_card_id,
          title: dbCard.title || "Card",
          status: "pending_sync",
          balance: 0,
          spend_cap: 0,
          spent_amount: 0,
          last_four: "****",
        }
      }
    })

    console.log("[v0] Returning", enrichedCards.length, "cards for user")
    return NextResponse.json(enrichedCards)
  } catch (error) {
    console.error("[v0] Error fetching cards:", error)
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
  }
}

// POST /api/cards - Create a new card
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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Error fetching user profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    if (profile.credits < 1) {
      console.log("[v0] Insufficient credits. User has:", profile.credits)
      return NextResponse.json(
        { error: "Insufficient credits. You need at least 1 credit to create a card." },
        { status: 403 },
      )
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id)
      .eq("credits", profile.credits)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Failed to deduct credit (possible race condition):", updateError)
      return NextResponse.json({ error: "Failed to deduct credit. Please try again." }, { status: 409 })
    }

    console.log("[v0] Credit deducted. New balance:", profile.credits - 1)

    const body = await request.json()
    console.log("[v0] Server: Creating card with data:", body)

    const requestData = {
      title: body.title,
      email: body.email,
      phone_number: body.phone_number,
      card_commission_id: body.card_commission_id || "5",
      currency_id: body.currency_id,
    }

    const headers = {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
    }

    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestData),
    })

    const responseText = await response.text()
    console.log("[v0] Server: ZeroID API response status:", response.status)

    if (!response.ok) {
      console.error("[v0] Card creation failed, refunding credit...")
      await supabase.from("profiles").update({ credits: profile.credits }).eq("id", user.id)

      let error
      try {
        error = JSON.parse(responseText)
      } catch {
        error = { message: responseText || "Failed to create card" }
      }

      let errorMessage = error.detail || error.message || "Failed to create card"

      if (errorMessage.includes("Vendor balance too low") || errorMessage.includes("balance too low")) {
        errorMessage =
          "Service temporarily unavailable. The card service is being refunded. Your credit has been refunded. Please try again later or contact support."
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = JSON.parse(responseText)
    console.log("[v0] Server: Card created successfully:", data)

    console.log("[v0] Attempting to store card mapping:", {
      user_id: user.id,
      zeroid_card_id: data.card_id,
    })

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabaseAdmin = createServerClient(supabaseUrl!, supabaseServiceKey, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })

    const { data: insertedCard, error: cardInsertError } = await supabaseAdmin
      .from("cards")
      .insert({
        user_id: user.id,
        zeroid_card_id: data.card_id,
        title: body.title || "Untitled Card",
      })
      .select()

    if (cardInsertError) {
      console.error("[v0] Failed to store card mapping. Full error:", JSON.stringify(cardInsertError, null, 2))
      console.error("[v0] Error code:", cardInsertError.code)
      console.error("[v0] Error message:", cardInsertError.message)
      console.error("[v0] Error details:", cardInsertError.details)
      console.error("[v0] Error hint:", cardInsertError.hint)

      // Return error to user so they know what went wrong
      return NextResponse.json(
        {
          error: "Card created in ZeroID but failed to link to your account. Please contact support.",
          details: cardInsertError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Card mapping stored successfully:", insertedCard)

    await supabaseAdmin.from("credit_transactions").insert({
      user_id: user.id,
      amount: -1,
      type: "card_creation",
      description: `Card created: ${body.title}`,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Server: Error creating card:", error)
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 })
  }
}
