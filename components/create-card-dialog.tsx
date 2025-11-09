"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, AlertCircle } from "lucide-react"
import { zeroidApi, type Currency } from "@/lib/zeroid-api"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

export function CreateCardDialog({ onCardCreated, userCredits }: { onCardCreated?: () => void; userCredits: number }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loadingCurrencies, setLoadingCurrencies] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    phone_number: "",
    card_commission_id: 5,
    currency_id: "",
  })
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      fetchCurrencies()
    }
  }, [open])

  const fetchCurrencies = async () => {
    try {
      setLoadingCurrencies(true)
      const data = await zeroidApi.getCurrencies()
      const currenciesWithBalance = data.filter((c) => Number.parseFloat(c.balance || "0") > 0)
      setCurrencies(currenciesWithBalance)
      if (currenciesWithBalance.length > 0) {
        setFormData((prev) => ({ ...prev, currency_id: currenciesWithBalance[0].currency_id }))
      }
    } catch (error) {
      console.error("[v0] Failed to fetch currencies:", error)
      toast({
        title: "Failed to load currencies",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoadingCurrencies(false)
    }
  }

  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/[^\d+]/g, "")
    if (!cleaned.startsWith("+")) {
      cleaned = "+" + cleaned
    }
    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setApiError(null)

    try {
      const formattedPhone = formatPhoneNumber(formData.phone_number)

      console.log("[v0] Creating card with data:", {
        ...formData,
        phone_number: formattedPhone,
      })

      await zeroidApi.createCard({
        title: formData.title,
        email: formData.email,
        phone_number: formattedPhone,
        card_commission_id: formData.card_commission_id,
        currency_id: formData.currency_id,
      })

      toast({
        title: "Card created successfully",
        description: "Your new card is ready to use. 1 credit has been deducted.",
      })

      setFormData({
        title: "",
        email: "",
        phone_number: "",
        card_commission_id: 5,
        currency_id: "",
      })

      setOpen(false)
      onCardCreated?.()
    } catch (error) {
      console.error("[v0] Card creation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Please try again"

      if (errorMessage.includes("Missing authentication or database session")) {
        setApiError("vendor_permission")
      } else {
        setApiError(errorMessage)
      }

      toast({
        title: "Failed to create card",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const totalBalance = currencies.reduce((sum, curr) => sum + Number.parseFloat(curr.balance || "0"), 0)
  const hasBalance = totalBalance > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2" disabled={userCredits < 1}>
          <Plus className="w-5 h-5" />
          Create New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Card</DialogTitle>
            <DialogDescription>Enter the details to create a new prepaid card (Costs 1 credit)</DialogDescription>
          </DialogHeader>

          {userCredits < 1 && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10 my-4">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertTitle className="text-yellow-500">Insufficient Credits</AlertTitle>
              <AlertDescription className="text-sm text-yellow-400">
                You need at least 1 credit to create a card. Contact the admin to purchase credits.
              </AlertDescription>
            </Alert>
          )}

          {!loadingCurrencies && currencies.length === 0 && (
            <Alert className="border-red-500/50 bg-red-500/10 my-4">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-500">No Funded Currencies</AlertTitle>
              <AlertDescription className="text-sm text-red-400">
                Your ZeroID account has no currencies with balance. Please fund your account with USDT or USDC before
                creating cards.
              </AlertDescription>
            </Alert>
          )}

          {apiError === "vendor_permission" && (
            <Alert className="border-red-500/50 bg-red-500/10 my-4">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-500 font-semibold">Vendor Permission Required</AlertTitle>
              <AlertDescription className="text-sm text-red-400 space-y-2 mt-2">
                <p>The card_commission_id you're using doesn't have permission or doesn't exist.</p>
                <p className="font-medium mt-3">Next steps:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Contact ZeroID support to get your valid card_commission_id values</li>
                  <li>Ask them which integer commission IDs (1, 2, 3, etc.) you have access to</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Card Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Business Card"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-background border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-background border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">Include country code (e.g., +92 for Pakistan)</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency_id}
                onValueChange={(value) => setFormData({ ...formData, currency_id: value })}
                disabled={currencies.length === 0}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder={currencies.length === 0 ? "No currencies available" : "Select currency"} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.currency_id} value={currency.currency_id}>
                      {currency.symbol} ({currency.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {currencies.length === 0
                  ? "Fund your ZeroID account to enable card creation"
                  : "Select the currency for this card"}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="commission">Card Commission ID</Label>
              <Input
                id="commission"
                type="number"
                placeholder="5"
                value={formData.card_commission_id}
                onChange={(e) => setFormData({ ...formData, card_commission_id: Number.parseInt(e.target.value) || 5 })}
                required
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">Using commission ID: 5 (as provided by ZeroID support)</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.currency_id || !formData.card_commission_id || currencies.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Card (1 Credit)"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
