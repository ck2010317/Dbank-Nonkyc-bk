"use server"

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY || "demo-key"
const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1"

export interface CreatePaymentParams {
  price_amount: number
  price_currency: string // 'usd'
  pay_currency: string // 'usdttrc20', 'usdcerc20', etc.
  order_id: string
  order_description: string
  ipn_callback_url?: string
}

export interface PaymentResponse {
  payment_id: string
  payment_status: string
  pay_address: string
  pay_amount: number
  pay_currency: string
  price_amount: number
  price_currency: string
  order_id: string
  order_description: string
  created_at: string
  updated_at: string
}

export async function createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
  console.log("[v0] Creating NOWPayments payment:", params)

  const response = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
    method: "POST",
    headers: {
      "x-api-key": NOWPAYMENTS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("[v0] NOWPayments API error:", error)
    throw new Error(`Failed to create payment: ${error}`)
  }

  const data = await response.json()
  console.log("[v0] NOWPayments payment created:", data)
  return data
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/payment/${paymentId}`, {
    headers: {
      "x-api-key": NOWPAYMENTS_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to get payment status")
  }

  return response.json()
}

export async function getAvailableCurrencies(): Promise<string[]> {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/currencies`, {
    headers: {
      "x-api-key": NOWPAYMENTS_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to get available currencies")
  }

  const data = await response.json()
  return data.currencies || []
}
