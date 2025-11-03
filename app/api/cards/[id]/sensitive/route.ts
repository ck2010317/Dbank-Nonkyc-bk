import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const API_BASE_URL = "https://app.zeroid.cc/api/b2b"
const API_KEY = process.env.ZEROID_API_KEY || "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI"

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

    const cardId = params.id
    console.log("[v0] Fetching sensitive details for card:", cardId)

    const response = await fetch(`${API_BASE_URL}/cards/${cardId}/sensitive`, {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] ZeroID API response status:", response.status)

    const responseText = await response.text()
    console.log("[v0] ZeroID API response body:", responseText)

    // Check if response is HTML (error page)
    if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
      console.error("[v0] Received HTML error page from ZeroID API")
      return NextResponse.json(
        { error: "ZeroID API is temporarily unavailable. Please try again later." },
        { status: 503 },
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("[v0] Failed to parse response as JSON:", parseError)
      return NextResponse.json({ error: "Invalid response from ZeroID API" }, { status: 500 })
    }

    if (!response.ok) {
      console.error("[v0] ZeroID API error:", data)
      return NextResponse.json(
        { error: data.detail || data.message || "Failed to fetch sensitive card details" },
        { status: response.status },
      )
    }

    console.log("[v0] Sensitive card details fetched successfully")
    return NextResponse.json(data.data || data)
  } catch (error) {
    console.error("[v0] Error fetching sensitive card details:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch sensitive card details" },
      { status: 500 },
    )
  }
}
