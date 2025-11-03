import { v4 as uuidv4 } from "uuid"

// User balance management system
// This tracks each user's balance separately from the ZeroID account

export interface UserBalance {
  userId: string
  currency: string
  balance: number
  lastUpdated: Date
}

export interface DepositRequest {
  id: string
  userId: string
  currency: string
  amount: number
  transactionHash: string
  status: "pending" | "verified" | "rejected"
  createdAt: Date
  verifiedAt?: Date
}

// In-memory storage (replace with database in production)
const userBalances = new Map<string, UserBalance[]>()
const depositRequests = new Map<string, DepositRequest>()

// Get current user ID from session/auth (placeholder)
export function getCurrentUserId(): string {
  // In production, get this from your auth system
  // For now, use localStorage or generate a session ID
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("dbank_user_id")
    if (!userId) {
      userId = uuidv4()
      localStorage.setItem("dbank_user_id", userId)
    }
    return userId
  }
  return "server-user"
}

// Get user's balance for a specific currency
export function getUserBalance(userId: string, currency: string): number {
  const balances = userBalances.get(userId) || []
  const balance = balances.find((b) => b.currency === currency)
  return balance?.balance || 0
}

// Get all user balances
export function getAllUserBalances(userId: string): UserBalance[] {
  return userBalances.get(userId) || []
}

// Submit a deposit request
export function submitDepositRequest(
  userId: string,
  currency: string,
  amount: number,
  transactionHash: string,
): DepositRequest {
  const request: DepositRequest = {
    id: uuidv4(),
    userId,
    currency,
    amount,
    transactionHash,
    status: "pending",
    createdAt: new Date(),
  }

  depositRequests.set(request.id, request)
  return request
}

// Get user's deposit requests
export function getUserDepositRequests(userId: string): DepositRequest[] {
  return Array.from(depositRequests.values()).filter((r) => r.userId === userId)
}

// Admin: Verify and credit a deposit
export function verifyDeposit(requestId: string, approved: boolean): boolean {
  const request = depositRequests.get(requestId)
  if (!request || request.status !== "pending") {
    return false
  }

  if (approved) {
    request.status = "verified"
    request.verifiedAt = new Date()

    // Credit user's balance
    const balances = userBalances.get(request.userId) || []
    const existingBalance = balances.find((b) => b.currency === request.currency)

    if (existingBalance) {
      existingBalance.balance += request.amount
      existingBalance.lastUpdated = new Date()
    } else {
      balances.push({
        userId: request.userId,
        currency: request.currency,
        balance: request.amount,
        lastUpdated: new Date(),
      })
    }

    userBalances.set(request.userId, balances)
  } else {
    request.status = "rejected"
  }

  depositRequests.set(requestId, request)
  return true
}

// Automatically approve and credit a deposit (used for verified transactions)
export function approveDeposit(userId: string, paymentId: string, amount: number): boolean {
  // Find the deposit request by payment ID
  const request = depositRequests.get(paymentId)

  if (!request) {
    console.error("[v0] Deposit request not found:", paymentId)
    return false
  }

  if (request.status !== "pending") {
    console.log("[v0] Deposit already processed:", paymentId)
    return false
  }

  request.status = "verified"
  request.verifiedAt = new Date()

  // Credit user's balance
  const balances = userBalances.get(userId) || []
  const existingBalance = balances.find((b) => b.currency === request.currency)

  if (existingBalance) {
    existingBalance.balance += amount
    existingBalance.lastUpdated = new Date()
  } else {
    balances.push({
      userId,
      currency: request.currency,
      balance: amount,
      lastUpdated: new Date(),
    })
  }

  userBalances.set(userId, balances)
  depositRequests.set(paymentId, request)

  console.log("[v0] Deposit approved and balance credited:", { userId, paymentId, amount })
  return true
}

export function addDepositRequest(
  userId: string,
  depositInfo: {
    currency: string
    amount: number
    transactionHash: string
    status: string
    paymentAddress?: string
    paymentId?: string
  },
): DepositRequest {
  const request: DepositRequest = {
    id: depositInfo.paymentId || uuidv4(),
    userId,
    currency: depositInfo.currency,
    amount: depositInfo.amount,
    transactionHash: depositInfo.transactionHash,
    status: depositInfo.status as "pending" | "verified" | "rejected",
    createdAt: new Date(),
  }

  depositRequests.set(request.id, request)
  return request
}

// Deduct balance when creating a card
export function deductBalance(userId: string, currency: string, amount: number): boolean {
  const balances = userBalances.get(userId) || []
  const balance = balances.find((b) => b.currency === currency)

  if (!balance || balance.balance < amount) {
    return false // Insufficient balance
  }

  balance.balance -= amount
  balance.lastUpdated = new Date()
  userBalances.set(userId, balances)
  return true
}
