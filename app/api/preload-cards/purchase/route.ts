import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const EXPECTED_PAYMENT_AMOUNT = 30 // $30 for preload cards
const PAYMENT_WALLET_ADDRESS = "0x46278303c6ffe76eda245d5e6c4cf668231f73a2"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "67GSQJI8I7B6JVQD6MG2DR5EGJDFXHN5S6"
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || ""
const CHAIN_ID = 8453 // Base network

export async function POST(request: Request) {
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

    const { preloadCardId, transactionHash } = await request.json()

    if (!preloadCardId || !transactionHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Processing preload card purchase:", { preloadCardId, transactionHash, userId: user.id })

    // Create admin client for database operations
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Step 1: Check if transaction hash has been used before (in blacklist)
    const { data: blacklistCheck } = await supabaseAdmin
      .from("used_transaction_hashes")
      .select("*")
      .eq("transaction_hash", transactionHash)
      .maybeSingle()

    if (blacklistCheck) {
      console.log("[v0] REJECTED: Transaction hash found in blacklist")
      return NextResponse.json(
        { error: "This transaction has already been used and cannot be reused" },
        { status: 400 },
      )
    }

    // Step 2: Check if transaction hash has been used for preload card purchase
    const { data: existingPurchase } = await supabaseAdmin
      .from("preload_card_purchases")
      .select("*")
      .eq("transaction_hash", transactionHash)
      .maybeSingle()

    if (existingPurchase) {
      console.log("[v0] REJECTED: Transaction hash already used for preload card purchase")
      return NextResponse.json({ error: "This transaction has already been used" }, { status: 400 })
    }

    // Step 3: Verify the card is still available
    const { data: card, error: cardError } = await supabaseAdmin
      .from("preload_cards")
      .select("*")
      .eq("id", preloadCardId)
      .eq("status", "available")
      .single()

    if (cardError || !card) {
      console.log("[v0] Card not available:", cardError)
      return NextResponse.json({ error: "Card is no longer available" }, { status: 400 })
    }

    // Step 4: Verify transaction on blockchain using Etherscan API v2
    console.log("[v0] Verifying transaction on blockchain...")

    let amountInUsd = 0

    try {
      // Use Etherscan API v2 format (same as credit purchases)
      const receiptUrl = `https://api.etherscan.io/v2/api?chainid=${CHAIN_ID}&module=proxy&action=eth_getTransactionReceipt&txhash=${transactionHash}&apikey=${ETHERSCAN_API_KEY}`
      const txUrl = `https://api.etherscan.io/v2/api?chainid=${CHAIN_ID}&module=proxy&action=eth_getTransactionByHash&txhash=${transactionHash}&apikey=${ETHERSCAN_API_KEY}`

      console.log("[v0] Fetching transaction from Etherscan API v2...")

      const [receiptResponse, txResponse] = await Promise.all([fetch(receiptUrl), fetch(txUrl)])

      if (!receiptResponse.ok || !txResponse.ok) {
        console.error("[v0] Etherscan API error:", receiptResponse.status, txResponse.status)
        return NextResponse.json({ error: "Transaction not found or invalid" }, { status: 400 })
      }

      const receiptData = await receiptResponse.json()
      const txData = await txResponse.json()

      console.log("[v0] Receipt response:", receiptData.status, receiptData.message)
      console.log("[v0] Transaction response:", txData.status, txData.message)

      if (receiptData.status === "0" || receiptData.message === "NOTOK") {
        return NextResponse.json({ error: "Transaction not found or invalid" }, { status: 400 })
      }

      const receipt = receiptData.result
      const transaction = txData.result

      if (!receipt || !transaction) {
        return NextResponse.json({ error: "Transaction not found or invalid" }, { status: 400 })
      }

      // Verify transaction was successful
      if (receipt.status !== "0x1") {
        return NextResponse.json({ error: "Transaction failed on blockchain" }, { status: 400 })
      }

      // Verify recipient address
      const toAddress = transaction.to?.toLowerCase()
      const expectedAddress = PAYMENT_WALLET_ADDRESS.toLowerCase()

      if (toAddress !== expectedAddress) {
        console.log("[v0] Payment sent to wrong address:", { toAddress, expectedAddress })
        return NextResponse.json({ error: "Payment was not sent to the correct address" }, { status: 400 })
      }

      // Get transaction value
      const valueHex = transaction.value
      if (!valueHex || valueHex === "0x0") {
        return NextResponse.json({ error: "No payment value found in transaction" }, { status: 400 })
      }

      const valueInWei = BigInt(valueHex)
      const valueInEth = Number(valueInWei) / 1e18

      console.log("[v0] Transaction value:", valueInEth, "ETH")

      // Get ETH price in USD
      const ethPriceResponse = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      )

      if (!ethPriceResponse.ok) {
        return NextResponse.json({ error: "Unable to verify payment amount. Please try again." }, { status: 500 })
      }

      const ethPriceData = await ethPriceResponse.json()
      const ethPriceUsd = ethPriceData.ethereum?.usd

      if (!ethPriceUsd) {
        return NextResponse.json({ error: "Unable to verify payment amount. Please try again." }, { status: 500 })
      }

      amountInUsd = valueInEth * ethPriceUsd

      console.log("[v0] Payment verification:", {
        valueInEth,
        ethPriceUsd,
        amountInUsd,
        expectedAmount: EXPECTED_PAYMENT_AMOUNT,
      })

      // Allow 5% tolerance for price fluctuations
      const minAmount = EXPECTED_PAYMENT_AMOUNT * 0.95

      if (amountInUsd < minAmount) {
        console.log("[v0] Insufficient payment amount")
        return NextResponse.json(
          {
            error: `Insufficient payment. Expected at least $${EXPECTED_PAYMENT_AMOUNT}, got $${amountInUsd.toFixed(2)}`,
          },
          { status: 400 },
        )
      }

      console.log("[v0] Payment verified successfully!")
    } catch (verificationError) {
      console.error("[v0] Blockchain verification error:", verificationError)
      return NextResponse.json({ error: "Transaction not found or invalid" }, { status: 400 })
    }

    // Step 5: Process the purchase (atomic operation)
    console.log("[v0] Payment verified, processing purchase...")

    // Mark card as sold
    const { error: updateError } = await supabaseAdmin
      .from("preload_cards")
      .update({ status: "sold", updated_at: new Date().toISOString() })
      .eq("id", preloadCardId)
      .eq("status", "available") // Ensure it's still available

    if (updateError) {
      console.error("[v0] Error updating card status:", updateError)
      return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 })
    }

    // Record the purchase
    const { error: purchaseError } = await supabaseAdmin.from("preload_card_purchases").insert({
      preload_card_id: preloadCardId,
      buyer_user_id: user.id,
      transaction_hash: transactionHash,
      amount_paid: amountInUsd,
    })

    if (purchaseError) {
      console.error("[v0] Error recording purchase:", purchaseError)
      // Rollback card status
      await supabaseAdmin.from("preload_cards").update({ status: "available" }).eq("id", preloadCardId)
      return NextResponse.json({ error: "Failed to record purchase" }, { status: 500 })
    }

    // Add transaction hash to blacklist
    await supabaseAdmin.from("used_transaction_hashes").insert({
      transaction_hash: transactionHash,
      network: "base",
      first_used_by: user.id,
    })

    // Create card mapping for the user
    const { error: mappingError } = await supabaseAdmin.from("card_user_mapping").insert({
      card_id: card.card_id,
      user_id: user.id,
      title: `Preload Card - $${card.balance}`,
    })

    if (mappingError) {
      console.error("[v0] Error creating card mapping:", mappingError)
    }

    console.log("[v0] Preload card purchase successful!")

    return NextResponse.json({
      success: true,
      message: "Card purchased successfully",
      cardId: card.card_id,
    })
  } catch (error) {
    console.error("[v0] Error in preload card purchase:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
