import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
import { zeroidApi } from "@/lib/zeroid-api"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "67GSQJI8I7B6JVQD6MG2DR5EGJDFXHN5S6"

// USDT/USDC contract addresses on different chains
const TOKEN_CONTRACTS = {
  base: {
    usdt: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  bsc: {
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  },
  ethereum: {
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  polygon: {
    usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  },
}

const CHAIN_IDS = {
  base: 8453,
  bsc: 56,
  ethereum: 1,
  polygon: 137,
}

async function verifyTransactionOnBlockchain(
  txHash: string,
  network: string,
  expectedRecipient: string,
  expectedAmount: number,
  expectedCurrency: string,
): Promise<{ valid: boolean; error?: string; actualAmount?: number }> {
  try {
    const chainId = CHAIN_IDS[network as keyof typeof CHAIN_IDS]
    if (!chainId) {
      return { valid: false, error: `Unsupported network: ${network}` }
    }

    const receiptUrl = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`

    console.log("[v0] Verifying card topup transaction:", { txHash, network, chainId })

    const receiptResponse = await fetch(receiptUrl)
    const receiptData = await receiptResponse.json()

    if (receiptData.status === "0" || receiptData.message === "NOTOK") {
      return { valid: false, error: receiptData.result || "Failed to fetch transaction from blockchain" }
    }

    const receipt = receiptData.result

    if (!receipt) {
      return { valid: false, error: "Transaction not found on blockchain" }
    }

    // Check if transaction was successful
    if (receipt.status !== "0x1") {
      return { valid: false, error: "Transaction failed on blockchain" }
    }

    const logs = receipt.logs || []
    const transferEventSignature = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

    for (const log of logs) {
      if (log.topics && log.topics[0] === transferEventSignature) {
        const tokenContract = log.address.toLowerCase()
        const tokens = TOKEN_CONTRACTS[network as keyof typeof TOKEN_CONTRACTS]

        if (tokens) {
          const expectedToken = expectedCurrency === "usdt" ? tokens.usdt : tokens.usdc

          if (tokenContract === expectedToken.toLowerCase()) {
            const recipient = "0x" + log.topics[2].slice(26)

            if (recipient.toLowerCase() === expectedRecipient.toLowerCase()) {
              const amountHex = log.data
              const amountWei = BigInt(amountHex)
              const actualAmount = Number(amountWei) / 1_000_000 // USDT/USDC have 6 decimals

              console.log("[v0] Token transfer found:", { amount: actualAmount, currency: expectedCurrency })

              if (actualAmount < expectedAmount) {
                return {
                  valid: false,
                  error: `Amount too low. Expected at least $${expectedAmount}, got $${actualAmount}`,
                  actualAmount,
                }
              }

              return { valid: true, actualAmount }
            }
          }
        }
      }
    }

    return {
      valid: false,
      error: `No ${expectedCurrency.toUpperCase()} transfer found to your wallet address in this transaction`,
    }
  } catch (error) {
    console.error("[v0] Blockchain verification error:", error)
    return { valid: false, error: "Failed to verify transaction on blockchain" }
  }
}

export async function POST(request: Request) {
  try {
    const { transactionHash, cardId, amount, currency, network } = await request.json()

    if (!transactionHash || !cardId || !amount || !currency || !network) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount < 10) {
      return NextResponse.json({ error: "Minimum top-up amount is $10" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Authenticated user:", user.id)

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check for duplicate transaction hash
    const { data: existingTx, error: checkError } = await supabaseAdmin
      .from("card_topup_requests")
      .select("id")
      .eq("transaction_hash", transactionHash)
      .single()

    if (existingTx) {
      return NextResponse.json({ error: "This transaction has already been used" }, { status: 400 })
    }

    if (checkError && checkError.code !== "PGRST116") {
      console.error("[v0] Error checking duplicate:", checkError)
      return NextResponse.json({ error: "Failed to check transaction" }, { status: 500 })
    }

    const paymentWallet = "0x46278303c6ffe76eda245d5e6c4cf668231f73a2"
    const normalizedNetwork = network.toLowerCase()
    const normalizedCurrency = currency.toLowerCase()

    const verification = await verifyTransactionOnBlockchain(
      transactionHash,
      normalizedNetwork,
      paymentWallet,
      amount,
      normalizedCurrency,
    )

    if (!verification.valid) {
      return NextResponse.json({ error: verification.error || "Transaction verification failed" }, { status: 400 })
    }

    const actualAmount = verification.actualAmount || amount

    console.log("[v0] Transaction verified, topping up card:", {
      cardId,
      amount: actualAmount,
      currency: normalizedCurrency,
    })

    // Top up the card via ZeroID API
    try {
      await zeroidApi.topUpCard({
        cardId,
        amount: actualAmount,
        currency: normalizedCurrency,
      })

      // Record successful top-up
      const { error: recordError } = await supabaseAdmin.from("card_topup_requests").insert({
        user_id: user.id,
        card_id: cardId,
        amount: actualAmount,
        currency: normalizedCurrency,
        network: normalizedNetwork,
        transaction_hash: transactionHash,
        status: "completed",
        completed_at: new Date().toISOString(),
      })

      if (recordError) {
        console.error("[v0] Error recording top-up:", recordError)
      }

      console.log("[v0] Card topped up successfully:", { cardId, amount: actualAmount })

      return NextResponse.json({
        success: true,
        amount: actualAmount,
        message: `Successfully added $${actualAmount.toFixed(2)} to your card`,
      })
    } catch (topupError) {
      console.error("[v0] ZeroID top-up failed:", topupError)

      // Record failed top-up
      await supabaseAdmin.from("card_topup_requests").insert({
        user_id: user.id,
        card_id: cardId,
        amount: actualAmount,
        currency: normalizedCurrency,
        network: normalizedNetwork,
        transaction_hash: transactionHash,
        status: "failed",
      })

      return NextResponse.json(
        { error: topupError instanceof Error ? topupError.message : "Failed to top up card" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Card top-up verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
