"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zeroidApi, type Currency } from "@/lib/zeroid-api"
import { Loader2, Wallet, CreditCard, Building2, Bitcoin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AccountTopUpDialogProps {
  onTopUpRequested?: () => void
}

export function AccountTopUpDialog({ onTopUpRequested }: AccountTopUpDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loadingCurrencies, setLoadingCurrencies] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null)

  const [formData, setFormData] = useState({
    amount: "",
    currency_id: "",
    payment_method: "crypto" as "crypto" | "bank" | "stripe",
  })

  const fetchCurrencies = async () => {
    try {
      setLoadingCurrencies(true)
      const data = await zeroidApi.getCurrencies()
      setCurrencies(data)
      if (data.length > 0 && !formData.currency_id) {
        setFormData((prev) => ({ ...prev, currency_id: data[0].currency_id }))
      }
    } catch (err) {
      console.error("[v0] Error fetching currencies:", err)
    } finally {
      setLoadingCurrencies(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      fetchCurrencies()
      setError(null)
      setSuccess(false)
      setPaymentInstructions(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const amount = Number.parseFloat(formData.amount)
    if (isNaN(amount) || amount < 10) {
      setError("Minimum top-up amount is $10")
      return
    }

    if (!formData.currency_id) {
      setError("Please select a currency")
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Creating payment with NOWPayments:", formData)

      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: formData.currency_id,
          userId: getCurrentUserId(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment")
      }

      console.log("[v0] Payment created:", data)

      setSuccess(true)
      setPaymentInstructions({
        type: "crypto",
        currency: data.payment.currency.toUpperCase(),
        address: data.payment.depositAddress,
        amount: data.payment.amount,
        paymentId: data.payment.paymentId,
        note: "Send the exact amount to the address above. Your balance will be credited automatically once the transaction is confirmed.",
      })

      if (onTopUpRequested) {
        onTopUpRequested()
      }
    } catch (err) {
      console.error("[v0] Payment creation error:", err)
      setError(err instanceof Error ? err.message : "Failed to create payment")
    } finally {
      setLoading(false)
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "crypto":
        return <Bitcoin className="w-4 h-4" />
      case "bank":
        return <Building2 className="w-4 h-4" />
      case "stripe":
        return <CreditCard className="w-4 h-4" />
      default:
        return <Wallet className="w-4 h-4" />
    }
  }

  const getCurrentUserId = () => {
    // Placeholder for getting current user ID
    return "user123"
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wallet className="w-4 h-4" />
          Top Up Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Top Up Account Balance</DialogTitle>
          <DialogDescription>
            Add funds to your dbank account. These funds will be available for creating new cards.
          </DialogDescription>
        </DialogHeader>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="10"
                placeholder="100.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Minimum: $10.00</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency_id}
                onValueChange={(value) => setFormData({ ...formData, currency_id: value })}
                disabled={loadingCurrencies}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingCurrencies ? "Loading..." : "Select currency"} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.currency_id} value={currency.currency_id}>
                      {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value: any) => setFormData({ ...formData, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">
                    <div className="flex items-center gap-2">
                      <Bitcoin className="w-4 h-4" />
                      Cryptocurrency
                    </div>
                  </SelectItem>
                  <SelectItem value="bank">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="stripe">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Credit/Debit Card
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {getPaymentMethodIcon(formData.payment_method)}
                    <span className="ml-2">Continue</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <Alert className="border-green-500/50 bg-green-500/10">
              <AlertDescription className="text-green-500">
                Top-up request created successfully! Please complete the payment using the instructions below.
              </AlertDescription>
            </Alert>

            {paymentInstructions && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">Payment Instructions</h4>

                {paymentInstructions.type === "crypto" && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Currency</Label>
                      <p className="font-mono text-sm">{paymentInstructions.currency}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Deposit Address</Label>
                      {paymentInstructions.address === "NOT_CONFIGURED" ? (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription className="text-xs">
                            ⚠️ Payment address not configured. Please contact support to set up crypto deposits.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <p className="font-mono text-sm break-all bg-background p-2 rounded">
                          {paymentInstructions.address}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Amount</Label>
                      <p className="font-mono text-sm">{paymentInstructions.amount} USD</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{paymentInstructions.note}</p>
                  </div>
                )}

                {paymentInstructions.type === "bank_transfer" && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Bank Name</Label>
                      <p className="text-sm">{paymentInstructions.bank_name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Account Number</Label>
                      <p className="font-mono text-sm">{paymentInstructions.account_number}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Routing Number</Label>
                      <p className="font-mono text-sm">{paymentInstructions.routing_number}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Reference</Label>
                      <p className="font-mono text-sm bg-background p-2 rounded">{paymentInstructions.reference}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Amount</Label>
                      <p className="font-mono text-sm">${paymentInstructions.amount}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{paymentInstructions.note}</p>
                  </div>
                )}

                {paymentInstructions.type === "card_payment" && (
                  <div className="space-y-2">
                    <p className="text-sm">{paymentInstructions.note}</p>
                    <Button className="w-full" onClick={() => window.open(paymentInstructions.checkout_url, "_blank")}>
                      Continue to Payment
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Alert>
              <AlertDescription className="text-xs">
                Once your payment is confirmed, your account balance will be updated automatically. This usually takes a
                few minutes for crypto payments and 1-3 business days for bank transfers.
              </AlertDescription>
            </Alert>

            <Button onClick={() => setOpen(false)} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
