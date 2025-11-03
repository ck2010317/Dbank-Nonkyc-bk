import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Fetching available preload cards...")
    const supabase = await createClient()

    const { data: cards, error } = await supabase
      .from("preload_cards")
      .select("id, card_number, cardholder_name, expiry_date, balance, price, created_at")
      .eq("status", "available")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching preload cards:", error)
      return NextResponse.json({ error: "Failed to fetch preload cards" }, { status: 500 })
    }

    console.log("[v0] Found", cards?.length || 0, "available preload cards")
    return NextResponse.json({ cards: cards || [] })
  } catch (error) {
    console.error("[v0] Error in preload cards GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
