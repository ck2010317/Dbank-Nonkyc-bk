// Blockchain transaction verification utility
// Supports automatic verification of ERC20 token transfers and TON USDT Jetton transfers

const DEPOSIT_ADDRESS = "0x46278303c6ffe76eda245d5e6c4cf668231f73a2"

// USDT contract address on Ethereum mainnet
const USDT_CONTRACT = "0xdac17f958d2ee523a2206206994597c13d831ec7"
// USDC contract address on Ethereum mainnet
const USDC_CONTRACT = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"

// TON USDT Jetton Master Contract
const TON_USDT_JETTON = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"

export const ERC20_DEPOSIT_ADDRESS = "0x46278303c6ffe76eda245d5e6c4cf668231f73a2"
export const TON_DEPOSIT_ADDRESS = "UQCpzpXAQkgrpGYtC3iD6HOSPRLhTIm3VCsPZXSKOyxFHjBn"

export function getDepositAddress(network: string): string {
  const normalizedNetwork = network.toUpperCase()
  
  // TON network uses different address
  if (normalizedNetwork === 'TON' || normalizedNetwork === 'TONUSDT') {
    return TON_DEPOSIT_ADDRESS
  }
  
  // All ERC20 networks (Ethereum, BSC, Polygon, Base) use same address
  return ERC20_DEPOSIT_ADDRESS
}

export function getNetworkLabel(network: string): string {
  const normalizedNetwork = network.toUpperCase()
  
  if (normalizedNetwork === 'TON' || normalizedNetwork === 'TONUSDT') {
    return 'TON Network'
  }
  
  return 'ERC20 (Ethereum, BSC, Polygon, Base)'
}

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

export async function verifyTonTransaction(
  txHash: string,
  expectedCurrency: string,
  expectedAmount: number,
): Promise<TransactionVerification> {
  try {
    console.log("[v0] Verifying TON transaction:", txHash)

    const apiKey = "4a6a37b64240968140b2ff80816707cdcabc683e046ccf54a25bf9307d850b80"
    const url = `https://toncenter.com/api/v2/getTransactions?address=${TON_DEPOSIT_ADDRESS}&limit=100&archival=true&api_key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (!data.ok || !data.result) {
      return {
        valid: false,
        amount: 0,
        currency: expectedCurrency,
        to: "",
        from: "",
        timestamp: 0,
        error: "Failed to fetch TON transactions",
      }
    }

    // Find the transaction by hash
    const transaction = data.result.find((tx: any) => {
      const txHashFormatted = tx.transaction_id?.hash || ""
      return txHashFormatted === txHash || Buffer.from(txHashFormatted, 'base64').toString('hex') === txHash
    })

    if (!transaction) {
      return {
        valid: false,
        amount: 0,
        currency: expectedCurrency,
        to: "",
        from: "",
        timestamp: 0,
        error: "Transaction not found",
      }
    }

    // Check if transaction is incoming
    const inMsg = transaction.in_msg
    if (!inMsg || !inMsg.value) {
      return {
        valid: false,
        amount: 0,
        currency: expectedCurrency,
        to: "",
        from: "",
        timestamp: 0,
        error: "Transaction has no incoming message",
      }
    }

    // For Jetton transfers, we need to decode the message
    let amount = 0
    let fromAddress = ""
    
    if (inMsg.msg_data) {
      try {
        // Decode Jetton transfer message
        // Jetton transfers have specific opcodes
        const msgData = inMsg.msg_data
        
        // Check if it's a Jetton transfer notification (opcode 0x7362d09c)
        if (msgData.body && typeof msgData.body === 'string') {
          const body = Buffer.from(msgData.body, 'base64')
          
          // Read opcode (first 4 bytes)
          const opcode = body.readUInt32BE(0)
          
          if (opcode === 0x7362d09c) {
            // This is a Jetton transfer notification
            // Extract amount (next 8 bytes as uint64)
            const amountNano = body.readBigUInt64BE(4)
            
            // USDT on TON uses 6 decimals
            amount = Number(amountNano) / 1_000_000
            
            console.log("[v0] Decoded Jetton transfer:", { amount })
          }
        }
        
        // Get sender address
        fromAddress = inMsg.source || ""
      } catch (error) {
        console.error("[v0] Error decoding TON message:", error)
      }
    }

    // If amount is still 0, try to get it from transaction value
    if (amount === 0 && inMsg.value) {
      // This might be a native TON transfer, but we expect Jetton transfers
      return {
        valid: false,
        amount: 0,
        currency: expectedCurrency,
        to: TON_DEPOSIT_ADDRESS,
        from: fromAddress,
        timestamp: 0,
        error: "Transaction is not a USDT Jetton transfer",
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
        to: TON_DEPOSIT_ADDRESS,
        from: fromAddress,
        timestamp: 0,
        error: `Amount mismatch: expected ${expectedAmount}, got ${amount}`,
      }
    }

    // Get transaction timestamp
    const timestamp = transaction.utime || Math.floor(Date.now() / 1000)

    return {
      valid: true,
      amount,
      currency: expectedCurrency,
      to: TON_DEPOSIT_ADDRESS,
      from: fromAddress,
      timestamp,
    }
  } catch (error) {
    console.error("[v0] Error verifying TON transaction:", error)
    return {
      valid: false,
      amount: 0,
      currency: expectedCurrency,
      to: "",
      from: "",
      timestamp: 0,
      error: "Failed to verify TON transaction",
    }
  }
}
