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

    // Get user's card mappings from database
    const { data: userCards, error: dbError } = await supabase
      .from("cards")
      .select("zeroid_card_id")
      .eq("user_id", user.id)

    if (dbError) {
      console.error("[v0] Error fetching user cards from database:", dbError)
      return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
    }

    const userCardIds = new Set(userCards?.map((c) => c.zeroid_card_id) || [])
    console.log("[v0] User has", userCardIds.size, "cards")

    // Fetch all cards from ZeroID
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

    if (!response.ok) {
      let error
      try {
        error = JSON.parse(responseText)
      } catch {
        error = { message: responseText || "Failed to fetch cards" }
      }
      console.error("[v0] ZeroID API error:", error)
      return NextResponse.json({ error: error.message || "Failed to fetch cards" }, { status: response.status })
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("[v0] Failed to parse response as JSON:", parseError)
      return NextResponse.json({ error: "Invalid response from ZeroID API" }, { status: 500 })
    }

    const cards = Array.isArray(data) ? data : data.cards || []
    console.log("[v0] ZeroID returned", cards.length, "total cards")

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

    const { data: allMappedCards } = await supabaseAdmin.from("cards").select("zeroid_card_id")

    const allMappedCardIds = new Set(allMappedCards?.map((c) => c.zeroid_card_id) || [])
    console.log("[v0] Found", allMappedCardIds.size, "total mapped cards in database")

    // Only try to sync cards that don't exist in database at all
    const unmappedCards = cards.filter((card: any) => !allMappedCardIds.has(card.id))

    if (unmappedCards.length > 0) {
      console.log("[v0] Found", unmappedCards.length, "unmapped cards. Auto-syncing to current user...")

      for (const card of unmappedCards) {
        try {
          const { error: insertError } = await supabaseAdmin.from("cards").insert({
            user_id: user.id,
            zeroid_card_id: card.id,
            title: card.title || "Untitled Card",
          })

          if (insertError) {
            console.error("[v0] Failed to sync card", card.id, ":", insertError.message)
          } else {
            console.log("[v0] Successfully synced card", card.id, "to user")
            userCardIds.add(card.id)
          }
        } catch (syncError) {
          console.error("[v0] Error syncing card", card.id, ":", syncError)
        }
      }
    }

    const userOwnedCards = cards.filter((card: any) => userCardIds.has(card.id))

    const cardsWithBalance = userOwnedCards.map((card: any) => ({
      ...card,
      balance: (card.spend_cap || 0) - (card.spent_amount || 0),
    }))

    console.log("[v0] Returning", cardsWithBalance.length, "cards for user")
    return NextResponse.json(cardsWithBalance)
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
      card_commission_id: body.card_commission_id || "3",
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
