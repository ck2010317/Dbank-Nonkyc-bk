import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const { email } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[v0] Missing Supabase credentials")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Create admin client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin.from("profiles").select("id").eq("id", userId).maybeSingle()

    if (existingProfile) {
      return NextResponse.json({ message: "Profile already exists", credits: 0 })
    }

    // Create new profile with 0 credits
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert({ id: userId, credits: 0, email: email || null })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Profile created successfully for user:", userId)
    return NextResponse.json({ message: "Profile created", credits: 0 })
  } catch (error) {
    console.error("[v0] Error in profile creation:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
