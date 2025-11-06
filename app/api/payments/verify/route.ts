import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

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

const COINGECKO_IDS = {
  base: "ethereum",
  bsc: "binancecoin",
  ethereum: "ethereum",
  polygon: "matic-network",
}

const FALLBACK_PRICES = {
  base: 3200,
  bsc: 600,
  ethereum: 3200,
  polygon: 0.8,
}

async function getNativeTokenPrice(network: string): Promise<number | null> {
  const coinId = COINGECKO_IDS[network as keyof typeof COINGECKO_IDS]
  if (!coinId) return null

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`, {
      headers: { Accept: "application/json" },
    })

    if (response.ok) {
      const data = await response.json()
      const price = data[coinId]?.usd
      if (price) {
        console.log(`[v0] ${network} price from CoinGecko: $${price}`)
        return price
      }
    }
  } catch (error) {
    console.log("[v0] CoinGecko failed, trying CoinCap...")
  }

  try {
    const coinCapIds: Record<string, string> = {
      ethereum: "ethereum",
      binancecoin: "binance-coin",
      "matic-network": "polygon",
    }
    const coinCapId = coinCapIds[coinId]

    if (coinCapId) {
      const response = await fetch(`https://api.coincap.io/v2/assets/${coinCapId}`)
      if (response.ok) {
        const data = await response.json()
        const price = Number.parseFloat(data.data?.priceUsd)
        if (price) {
          console.log(`[v0] ${network} price from CoinCap: $${price}`)
          return price
        }
      }
    }
  } catch (error) {
    console.log("[v0] CoinCap failed, trying Binance...")
  }

  try {
    const binanceSymbols: Record<string, string> = {
      ethereum: "ETHUSDT",
      binancecoin: "BNBUSDT",
      "matic-network": "MATICUSDT",
    }
    const symbol = binanceSymbols[coinId]

    if (symbol) {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
      if (response.ok) {
        const data = await response.json()
        const price = Number.parseFloat(data.price)
        if (price) {
          console.log(`[v0] ${network} price from Binance: $${price}`)
          return price
        }
      }
    }
  } catch (error) {
    console.log("[v0] Binance failed, using fallback fixed rate...")
  }

  const fallbackPrice = FALLBACK_PRICES[network as keyof typeof FALLBACK_PRICES]
  if (fallbackPrice) {
    console.log(`[v0] ${network} price from fallback: $${fallbackPrice} (approximate)`)
    return fallbackPrice
  }

  return null
}

async function verifyTransactionOnBlockchain(
  txHash: string,
  network: string,
  expectedRecipient: string,
  expectedAmount: number,
  etherscanApiKey: string,
): Promise<{ valid: boolean; error?: string; actualAmount?: number; isNativeToken?: boolean }> {
  try {
    const chainId = CHAIN_IDS[network as keyof typeof CHAIN_IDS]
    if (!chainId) {
      return { valid: false, error: `Unsupported network: ${network}` }
    }

    const receiptUrl = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${etherscanApiKey}`
    const txUrl = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${etherscanApiKey}`

    console.log("[v0] Verifying transaction on blockchain:", { txHash, network, chainId })
    console.log("[v0] Receipt URL:", receiptUrl)
    console.log("[v0] Transaction URL:", txUrl)

    const [receiptResponse, txResponse] = await Promise.all([fetch(receiptUrl), fetch(txUrl)])

    console.log("[v0] Receipt HTTP status:", receiptResponse.status, receiptResponse.statusText)
    console.log("[v0] Transaction HTTP status:", txResponse.status, txResponse.statusText)

    const receiptData = await receiptResponse.json()
    const txData = await txResponse.json()

    console.log("[v0] Receipt API full response:", JSON.stringify(receiptData))
    console.log("[v0] Transaction API full response:", JSON.stringify(txData))

    console.log("[v0] Receipt API response:", receiptData.status, receiptData.message)
    console.log("[v0] Transaction API response:", txData.status, txData.message)

    if (!receiptResponse.ok || !txResponse.ok) {
      return {
        valid: false,
        error: `Blockchain API error: Receipt ${receiptResponse.status}, Transaction ${txResponse.status}`,
      }
    }

    if (receiptData.status === "0" || receiptData.message === "NOTOK") {
      return { valid: false, error: receiptData.result || "Failed to fetch transaction from blockchain" }
    }

    const receipt = receiptData.result
    const transaction = txData.result

    if (!receipt || !transaction) {
      return {
        valid: false,
        error: `Transaction not found on blockchain. Receipt: ${!!receipt}, Transaction: ${!!transaction}`,
      }
    }

    console.log("[v0] Transaction status:", receipt.status)

    const logs = receipt.logs || []
    console.log("[v0] Number of logs in receipt:", logs.length)

    const transferEventSignature = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

    for (const log of logs) {
      if (log.topics && log.topics[0] === transferEventSignature) {
        const tokenContract = log.address.toLowerCase()
        const tokens = TOKEN_CONTRACTS[network as keyof typeof TOKEN_CONTRACTS]

        if (tokens && (tokenContract === tokens.usdt.toLowerCase() || tokenContract === tokens.usdc.toLowerCase())) {
          const recipient = "0x" + log.topics[2].slice(26)

          if (recipient.toLowerCase() === expectedRecipient.toLowerCase()) {
            const amountHex = log.data
            const amountWei = BigInt(amountHex)
            const actualAmount = Number(amountWei) / 1_000_000

            console.log("[v0] USDT/USDC transfer found:", { amount: actualAmount })

            if (actualAmount < expectedAmount) {
              return {
                valid: false,
                error: `Amount too low. Expected at least $${expectedAmount}, got $${actualAmount}`,
                actualAmount,
              }
            }

            return { valid: true, actualAmount, isNativeToken: false }
          }
        }
      }
    }

    console.log("[v0] No USDT/USDC transfer found, checking for native token transfer...")

    const recipientAddress = transaction.to?.toLowerCase()
    const valueHex = transaction.value

    console.log("[v0] Transaction details:", {
      to: recipientAddress,
      expected: expectedRecipient.toLowerCase(),
      value: valueHex,
    })

    if (recipientAddress !== expectedRecipient.toLowerCase()) {
      return {
        valid: false,
        error: "Transaction recipient does not match your wallet address",
      }
    }

    if (!valueHex || valueHex === "0x0") {
      return {
        valid: false,
        error: "No USDT/USDC or native token transfer found in this transaction",
      }
    }

    const valueWei = BigInt(valueHex)
    const tokenAmount = Number(valueWei) / 1e18

    console.log("[v0] Native token transfer found:", { tokenAmount })

    const tokenPrice = await getNativeTokenPrice(network)

    if (!tokenPrice) {
      return {
        valid: false,
        error: "Unable to fetch token price. Please try again or use USDT/USDC",
      }
    }

    const usdAmount = tokenAmount * tokenPrice

    console.log("[v0] Native token value:", {
      tokenAmount,
      tokenPrice,
      usdAmount,
    })

    if (usdAmount < expectedAmount) {
      return {
        valid: false,
        error: `Amount too low. Expected at least $${expectedAmount}, got $${usdAmount.toFixed(2)} (${tokenAmount.toFixed(6)} tokens at $${tokenPrice})`,
        actualAmount: usdAmount,
      }
    }

    return { valid: true, actualAmount: usdAmount, isNativeToken: true }
  } catch (error) {
    console.error("[v0] Blockchain verification error:", error)
    return { valid: false, error: "Failed to verify transaction on blockchain" }
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] Payment verification request received")

    const body = await request.json()
    const { transactionHash, amount, currency, network } = body

    console.log("[v0] Request data:", { transactionHash, amount, currency, network })

    if (!transactionHash || !amount || !currency || !network) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount < 15) {
      return NextResponse.json({ error: "Minimum payment is $15 (1 credit)" }, { status: 400 })
    }

    const supabase = await createClient()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Authenticated user:", user.id)

    console.log("[v0] Checking permanent blacklist for transaction hash:", transactionHash)

    const { data: blacklistedHash, error: blacklistError } = await supabaseAdmin
      .from("used_transaction_hashes")
      .select("id, first_used_by, first_used_at, network")
      .eq("transaction_hash", transactionHash)
      .maybeSingle()

    if (blacklistError) {
      console.log("[v0] Blacklist check error (table may not exist):", blacklistError.message)
      console.log("[v0] Falling back to credit_transactions check...")
    } else if (blacklistedHash) {
      console.log("[v0] REJECTED: Transaction hash found in permanent blacklist:", {
        hash: transactionHash,
        firstUsedBy: blacklistedHash.first_used_by,
        firstUsedAt: blacklistedHash.first_used_at,
        network: blacklistedHash.network,
      })
      return NextResponse.json(
        {
          error: "This transaction has already been used and cannot be reused",
        },
        { status: 400 },
      )
    } else {
      console.log("[v0] Transaction hash not in blacklist, proceeding...")
    }

    console.log("[v0] Checking credit_transactions for duplicate transaction hash:", transactionHash)

    const { data: existingTxs } = await supabaseAdmin
      .from("credit_transactions")
      .select("description")
      .eq("type", "purchase")

    console.log("[v0] Found", existingTxs?.length || 0, "existing purchase transactions")

    if (existingTxs && existingTxs.length > 0) {
      for (const tx of existingTxs) {
        if (!tx.description) continue

        try {
          const desc = typeof tx.description === "string" ? JSON.parse(tx.description) : tx.description

          if (desc.transactionHash === transactionHash) {
            console.log("[v0] REJECTED: Duplicate transaction hash detected in credit_transactions")
            return NextResponse.json(
              {
                error: "This transaction has already been used",
              },
              { status: 400 },
            )
          }
        } catch (e) {
          const descStr = typeof tx.description === "string" ? tx.description : JSON.stringify(tx.description)
          if (descStr.includes(transactionHash)) {
            console.log("[v0] REJECTED: Duplicate transaction hash detected (string match)")
            return NextResponse.json(
              {
                error: "This transaction has already been used",
              },
              { status: 400 },
            )
          }
        }
      }
    }

    console.log("[v0] Transaction hash is unique, proceeding with verification")

    const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "67GSQJI8I7B6JVQD6MG2DR5EGJDFXHN5S6"

    const paymentWallet = "0xaCafF1D35Fff8CE718c51EDA1b633687C4F56fd6"
    const normalizedNetwork = network.toLowerCase()
    const verification = await verifyTransactionOnBlockchain(
      transactionHash,
      normalizedNetwork,
      paymentWallet,
      amount,
      etherscanApiKey,
    )

    if (!verification.valid) {
      return NextResponse.json({ error: verification.error || "Transaction verification failed" }, { status: 400 })
    }

    const actualAmount = verification.actualAmount || amount
    const creditsToAdd = Math.floor(actualAmount / 15)

    if (creditsToAdd < 1) {
      return NextResponse.json({ error: "Amount too low. Minimum $15 for 1 credit" }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[v0] Profile error:", profileError)
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    const currentCredits = profile?.credits || 0
    const newCredits = currentCredits + creditsToAdd

    console.log("[v0] Adding credits:", { currentCredits, creditsToAdd, newCredits })

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", user.id)

    if (updateError) {
      console.error("[v0] Error updating credits:", updateError)
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
    }

    const { error: txError } = await supabaseAdmin.from("credit_transactions").insert({
      user_id: user.id,
      amount: creditsToAdd,
      type: "purchase",
      description: JSON.stringify({
        transactionHash,
        network: normalizedNetwork,
        amount: actualAmount,
        currency,
        verifiedAt: new Date().toISOString(),
      }),
    })

    if (txError) {
      console.error("[v0] Error recording transaction:", txError)
      await supabaseAdmin.from("profiles").update({ credits: currentCredits }).eq("id", user.id)
      return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 })
    }

    const { error: blacklistInsertError } = await supabaseAdmin.from("used_transaction_hashes").insert({
      transaction_hash: transactionHash,
      network: normalizedNetwork,
      first_used_by: user.id,
    })

    if (blacklistInsertError) {
      console.log("[v0] Warning: Failed to add hash to blacklist (table may not exist):", blacklistInsertError.message)
      console.log("[v0] Transaction is still recorded in credit_transactions for duplicate detection")
    } else {
      console.log("[v0] Transaction hash added to permanent blacklist")
    }

    console.log("[v0] Payment verified successfully:", { creditsAdded: creditsToAdd, newBalance: newCredits })

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
      newBalance: newCredits,
      verifiedAmount: actualAmount,
      message: `Successfully added ${creditsToAdd} credits to your account`,
    })
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
