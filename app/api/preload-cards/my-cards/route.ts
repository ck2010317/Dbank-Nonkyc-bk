import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's purchased preload cards with full details
    const { data: purchases, error } = await supabase
      .from("preload_card_purchases")
      .select(
        `
        *,
        preload_cards (
          id,
          card_id,
          card_number,
          cardholder_name,
          expiry_date,
          cvv,
          balance,
          price
        )
      `,
      )
      .eq("buyer_user_id", user.id)
      .order("purchased_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching purchased cards:", error)
      return NextResponse.json({ error: "Failed to fetch purchased cards" }, { status: 500 })
    }

    return NextResponse.json({ purchases: purchases || [] })
  } catch (error) {
    console.error("[v0] Error in my-cards GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
