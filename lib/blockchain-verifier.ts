// Blockchain transaction verification utility
// Supports automatic verification of ERC20 token transfers

const DEPOSIT_ADDRESS = "0xeAd07a01AD220AD359680E77C227535E9811Fd24"

// USDT contract address on Ethereum mainnet
const USDT_CONTRACT = "0xdac17f958d2ee523a2206206994597c13d831ec7"
// USDC contract address on Ethereum mainnet
const USDC_CONTRACT = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"

interface TransactionVerification {
  valid: boolean
  amount: number
  currency: string
  to: string
  from: string
  timestamp: number
  error?: string
}

export async function verifyTransaction(
  txHash: string,
  expectedCurrency: string,
  expectedAmount: number,
): Promise<TransactionVerification> {
  try {
    console.log("[v0] Verifying transaction:", txHash)

    // Use Etherscan API to verify the transaction
    const apiKey = process.env.ETHERSCAN_API_KEY || "YourApiKeyToken"
    const url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (!data.result) {
      return {
        valid: false,
        amount: 0,
        currency: expectedCurrency,
        to: "",
        from: "",
        timestamp: 0,
        error: "Transaction not found or still pending",
      }
    }

    const tx = data.result

    // Check if transaction is to the correct address
    const toAddress = tx.to?.toLowerCase()
    const contractAddress = expectedCurrency === "usdt" ? USDT_CONTRACT.toLowerCase() : USDC_CONTRACT.toLowerCase()

    if (toAddress !== contractAddress) {
      return {
        valid: false,
        amount: 0,
        currency: expectedCurrency,
        to: toAddress || "",
        from: tx.from,
        timestamp: 0,
        error: "Transaction is not to the correct token contract",
      }
    }

    // Decode the input data to get the transfer details
    // ERC20 transfer function signature: transfer(address,uint256)
    const inputData = tx.input

    if (!inputData.startsWith("0xa9059cbb")) {
      return {
        valid: false,
        amount: 0,
        currency: expectedCurrency,
        to: toAddress || "",
        from: tx.from,
        timestamp: 0,
        error: "Transaction is not a token transfer",
      }
    }

    // Extract recipient address (bytes 4-36) and amount (bytes 36-68)
    const recipientAddress = "0x" + inputData.slice(34, 74)
    const amountHex = inputData.slice(74)
    const amountWei = BigInt("0x" + amountHex)

    // Convert to decimal (USDT and USDC both use 6 decimals)
    const decimals = 6
    const amount = Number(amountWei) / Math.pow(10, decimals)

    console.log("[v0] Decoded transaction:", {
      recipient: recipientAddress,
      amount,
      expectedAmount,
    })

    // Check if recipient is the deposit address
    if (recipientAddress.toLowerCase() !== DEPOSIT_ADDRESS.toLowerCase()) {
      return {
        valid: false,
        amount,
        currency: expectedCurrency,
        to: recipientAddress,
        from: tx.from,
        timestamp: 0,
        error: "Transaction is not to the deposit address",
      }
    }

    // Check if amount matches (allow 1% tolerance for rounding)
    const amountDiff = Math.abs(amount - expectedAmount)
    const tolerance = expectedAmount * 0.01

    if (amountDiff > tolerance) {
      return {
        valid: false,
        amount,
        currency: expectedCurrency,
        to: recipientAddress,
        from: tx.from,
        timestamp: 0,
        error: `Amount mismatch: expected ${expectedAmount}, got ${amount}`,
      }
    }

    // Get block timestamp
    const blockNumber = tx.blockNumber
    if (!blockNumber) {
      return {
        valid: false,
        amount,
        currency: expectedCurrency,
        to: recipientAddress,
        from: tx.from,
        timestamp: 0,
        error: "Transaction is still pending",
      }
    }

    const blockUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true&apikey=${apiKey}`
    const blockResponse = await fetch(blockUrl)
    const blockData = await blockResponse.json()
    const timestamp = blockData.result ? Number.parseInt(blockData.result.timestamp, 16) : Date.now() / 1000

    return {
      valid: true,
      amount,
      currency: expectedCurrency,
      to: recipientAddress,
      from: tx.from,
      timestamp,
    }
  } catch (error) {
    console.error("[v0] Error verifying transaction:", error)
    return {
      valid: false,
      amount: 0,
      currency: expectedCurrency,
      to: "",
      from: "",
      timestamp: 0,
      error: "Failed to verify transaction",
    }
  }
}
