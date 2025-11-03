import { type NextRequest, NextResponse } from "next/server"
import { submitDepositRequest, getUserDepositRequests, approveDeposit } from "@/lib/user-balance"
import { verifyTransaction } from "@/lib/blockchain-verifier"
import { createClient } from "@/lib/supabase/server"

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

    const body = await request.json()
    const { currency, amount, transactionHash } = body

    if (!currency || !amount || !transactionHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const userId = user.id

    console.log("[v0] Verifying deposit transaction:", { currency, amount, transactionHash })

    const verification = await verifyTransaction(transactionHash, currency, amount)

    if (!verification.valid) {
      console.log("[v0] Transaction verification failed:", verification.error)
      return NextResponse.json(
        {
          error: verification.error || "Transaction verification failed",
          details: verification,
        },
        { status: 400 },
      )
    }

    console.log("[v0] Transaction verified successfully:", verification)

    // Submit the deposit request
    const depositRequest = submitDepositRequest(userId, currency, amount, transactionHash)

    approveDeposit(depositRequest.id)

    console.log("[v0] Deposit auto-approved:", depositRequest)

    return NextResponse.json({
      success: true,
      request: depositRequest,
      message: "Deposit verified and credited to your account!",
      autoApproved: true,
    })
  } catch (error) {
    console.error("[v0] Error processing deposit:", error)
    return NextResponse.json({ error: "Failed to process deposit" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    const userId = user.id
    const requests = getUserDepositRequests(userId)

    console.log("[v0] Fetching deposit requests for:", userId)
    console.log("[v0] Deposit requests:", requests)

    return NextResponse.json({
      success: true,
      requests,
    })
  } catch (error) {
    console.error("[v0] Error fetching deposits:", error)
    return NextResponse.json({ error: "Failed to fetch deposits" }, { status: 500 })
  }
}
