const API_BASE_URL = "https://app.zeroid.cc/api/b2b"
const API_KEY = "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI"

export interface Card {
  id: string
  title: string
  last4: string
  expiration_date: string
  expiration_date_short: string
  form_factor: string
  status: string
  currency: string
  created_at: string
  updated_at: string
  sub_account_id: string | null
  vendor_sub_account_id: string | null
  brand: string
  vendor_id: string
  vendor_card_id: string
  email?: string
  phone?: string
  balance?: number
  spend_cap?: number
  spent_amount?: number
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  createdAt?: string
}

export interface Transaction {
  id: string
  cardId: string
  amount: number
  currency: string
  type: "debit" | "credit"
  description: string
  timestamp: string
  status: "COMPLETED" | "DECLINED" | "PENDING" | "FAILED" | "PROCESSING"
}

export interface CreateCardRequest {
  title: string
  email: string
  phone_number: string
  card_commission_id: number
  currency_id: string
}

export interface TopUpRequest {
  cardId: string
  amount: number
  currency: string
}

export interface AccountTopUpRequest {
  amount: number
  currency_id: string
  payment_method: "crypto" | "bank" | "stripe"
}

export interface Currency {
  currency_id: string
  name: string
  symbol: string
  code: string
  network: string
  decimals: number
  balance: string
}

export interface Vendor {
  id: string
  name: string
  description?: string
  type?: string
  currency?: string
  currency_id?: string
}

export interface SensitiveCardDetails {
  card_number: string
  cvv: string
  expiry_date: string
  security_code: string | null
  vendor_b2b_key: string
  vendor_name: string
  currency: string
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API request failed" }))
    throw new Error(error.error || error.message || `API Error: ${response.status}`)
  }

  return response.json()
}

const DEMO_MODE = false // Disabled demo mode to use real ZeroID API

function generateMockCard(index: number): Card {
  const cardNumber = `4532 ${1000 + index}${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)} ${Math.floor(Math.random() * 10000)}`
  return {
    id: `demo-card-${index}`,
    title: `Demo Card ${index}`,
    last4: cardNumber.split(" ").pop()!,
    expiration_date: `202${6 + Math.floor(Math.random() * 3)}-12-31`,
    expiration_date_short: `12/2${6 + Math.floor(Math.random() * 3)}`,
    form_factor: "physical",
    status: Math.random() > 0.2 ? "active" : "frozen",
    currency: "USD",
    created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    sub_account_id: null,
    vendor_sub_account_id: null,
    brand: "Visa",
    vendor_id: "1",
    vendor_card_id: `vendor-card-${index}`,
    email: `user${index}@example.com`,
    phone: `+1234567${String(index).padStart(3, "0")}`,
    balance: Math.floor(Math.random() * 5000) + 100,
    spend_cap: Math.floor(Math.random() * 10000) + 5000,
    spent_amount: Math.floor(Math.random() * 5000),
    cardNumber,
    expiryDate: `12/2${6 + Math.floor(Math.random() * 3)}`,
    cvv: String(Math.floor(Math.random() * 900) + 100),
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }
}

export const zeroidApi = {
  // Create a new card
  createCard: async (data: CreateCardRequest): Promise<Card> => {
    console.log("[v0] Creating card with data:", data)

    if (DEMO_MODE) {
      console.log("[v0] Demo mode: Creating mock card")
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
      const mockCard: Card = {
        id: `demo-card-${Date.now()}`,
        title: data.title,
        last4: `1234`,
        expiration_date: `2028-12-31`,
        expiration_date_short: `12/28`,
        form_factor: "physical",
        status: "active",
        currency: "USD",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sub_account_id: null,
        vendor_sub_account_id: null,
        brand: "Visa",
        vendor_id: "1",
        vendor_card_id: `vendor-card-${Date.now()}`,
        email: data.email,
        phone: data.phone_number,
        balance: 0,
        spend_cap: Math.floor(Math.random() * 10000) + 5000,
        spent_amount: Math.floor(Math.random() * 5000),
        cardNumber: `4532 ${Math.floor(Math.random() * 10000)} ${Math.floor(Math.random() * 10000)} ${Math.floor(Math.random() * 10000)}`,
        expiryDate: "12/28",
        cvv: String(Math.floor(Math.random() * 900) + 100),
        createdAt: new Date().toISOString(),
      }
      console.log("[v0] Demo mode: Mock card created:", mockCard)
      return mockCard
    }

    try {
      const response = await apiRequest("/cards", {
        method: "POST",
        body: JSON.stringify(data),
      })
      console.log("[v0] Card created successfully:", response)
      return response
    } catch (error) {
      console.error("[v0] Card creation failed:", error)
      throw error
    }
  },

  // Get all cards
  getCards: async (): Promise<Card[]> => {
    console.log("[v0] Client: Fetching cards...")

    if (DEMO_MODE) {
      console.log("[v0] Demo mode: Returning mock cards")
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
      const mockCards = Array.from({ length: 3 }, (_, i) => generateMockCard(i))
      console.log("[v0] Demo mode: Mock cards:", mockCards)
      return mockCards
    }

    const response = await apiRequest("/cards")
    console.log("[v0] Client: Received response:", response)
    return Array.isArray(response) ? response : []
  },

  getCard: async (cardId: string): Promise<Card> => {
    const cards = await zeroidApi.getCards()
    const card = cards.find((c) => c.id === cardId)
    if (!card) {
      throw new Error("Card not found")
    }
    return card
  },

  getCardSensitiveDetails: async (cardId: string): Promise<SensitiveCardDetails> => {
    console.log("[v0] Fetching sensitive details for card:", cardId)
    return apiRequest(`/cards/${cardId}/sensitive`)
  },

  // Freeze card
  freezeCard: async (cardId: string): Promise<void> => {
    return apiRequest(`/cards/${cardId}/freeze`, {
      method: "POST",
    })
  },

  // Unfreeze card
  unfreezeCard: async (cardId: string): Promise<void> => {
    return apiRequest(`/cards/${cardId}/unfreeze`, {
      method: "POST",
    })
  },

  // Top up card
  topUpCard: async (data: TopUpRequest): Promise<void> => {
    return apiRequest("/cards/topup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  getTransactions: async (
    cardId: string,
    params?: {
      startDate?: string
      endDate?: string
      page?: number
      limit?: number
    },
  ): Promise<Transaction[]> => {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append("from_date", params.startDate)
    if (params?.endDate) queryParams.append("to_date", params.endDate)
    if (params?.page) queryParams.append("skip", ((params.page - 1) * (params.limit || 20)).toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const query = queryParams.toString()
    const response = await apiRequest(`/cards/${cardId}/transactions${query ? `?${query}` : ""}`)

    // ZeroID API returns transactions in a data property
    if (response && Array.isArray(response.data)) {
      return response.data.map((t: any) => {
        // Card purchases (merchant transactions) should always be debits (money spent)
        // Top-ups and refunds should be credits (money received)
        let transactionType: "debit" | "credit"

        // Check if this is a merchant transaction (card purchase)
        const isMerchantTransaction = t.merchant && t.merchant.name

        // Check if billing_amount is negative (traditional debit indicator)
        const isNegativeAmount = (t.billing_amount || 0) < 0

        // Determine transaction type:
        // 1. If it has a merchant, it's a purchase (debit)
        // 2. Otherwise, use billing_amount sign (negative = debit, positive = credit)
        if (isMerchantTransaction) {
          transactionType = "debit" // Card purchases are always debits
        } else {
          transactionType = isNegativeAmount ? "debit" : "credit"
        }

        return {
          id: t.id,
          cardId: cardId,
          amount: Math.abs(t.billing_amount || 0),
          currency: t.billing_currency || "USD",
          type: transactionType,
          description: t.merchant?.name || "Transaction",
          timestamp: t.created_at,
          status: t.status || "COMPLETED",
        }
      })
    }

    // Fallback for empty or invalid response
    return []
  },

  getCurrencies: async (): Promise<Currency[]> => {
    if (DEMO_MODE) {
      console.log("[v0] Demo mode: Returning mock currencies")
      return [
        {
          currency_id: "usdt",
          name: "Tether USD",
          symbol: "USDT",
          code: "USDT",
          network: "Solana",
          decimals: 6,
          balance: "1000.00",
        },
        {
          currency_id: "usdc",
          name: "USDC",
          symbol: "USDC",
          code: "USDC",
          network: "Ethereum",
          decimals: 6,
          balance: "500.00",
        },
      ]
    }

    const response = await apiRequest("/currencies")
    console.log("[v0] Currencies response:", response)
    // Handle both array response and wrapped response
    if (Array.isArray(response)) {
      return response
    }
    if (response && Array.isArray(response.currencies)) {
      return response.currencies
    }
    return []
  },

  // Get balance
  getBalance: async (): Promise<{ balance: number; currency: string }> => {
    return apiRequest("/balance")
  },

  accountTopUp: async (data: AccountTopUpRequest) => {
    console.log("[v0] Creating account top-up request:", data)
    const response = await apiRequest("/topup", {
      method: "POST",
      body: JSON.stringify(data),
    })
    console.log("[v0] Account top-up request created:", response)
    return response
  },

  getVendors: async (): Promise<Vendor[]> => {
    console.log("[v0] Fetching vendors from ZeroID API...")
    if (DEMO_MODE) {
      console.log("[v0] Demo mode: Returning mock vendors")
      return [
        {
          id: "1",
          name: "Visa Business",
          description: "Business Visa cards with global acceptance",
          b2b_key: "visa_business_key",
        },
        {
          id: "2",
          name: "Mastercard Corporate",
          description: "Corporate Mastercard solutions",
          b2b_key: "mc_corporate_key",
        },
      ]
    }

    const response = await apiRequest("/vendors")
    console.log("[v0] Vendors response:", response)
    // Handle both array response and wrapped response
    if (Array.isArray(response)) {
      return response
    }
    if (response && Array.isArray(response.vendors)) {
      return response.vendors
    }
    return []
  },
}
