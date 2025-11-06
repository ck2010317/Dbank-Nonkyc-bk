"use client"
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
import { Plus, Loader2, DollarSign, Coins, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createBrowserClient } from "@supabase/ssr"

interface TopUpDialogProps {
  cardId: string
  onSuccess?: () => void
}

const TOPUP_AMOUNTS = [
  { amount: 15, credits: 1 },
  { amount: 30, credits: 2 },
  { amount: 45, credits: 3 },
  { amount: 60, credits: 4 },
  { amount: 75, credits: 5 },
  { amount: 100, credits: 7 }, // Rounded up: 100/15 = 6.67 → 7 credits
]

export function TopUpDialog({ cardId, onSuccess }: TopUpDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userCredits, setUserCredits] = useState(0)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchUserCredits()
    }
  }, [open])

  const fetchUserCredits = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single()

      if (profile) {
        setUserCredits(profile.credits || 0)
      }
    } catch (error) {
      console.error("[v0] Error fetching user credits:", error)
    }
  }

  const handleTopUp = async (amount: number, creditsNeeded: number) => {
    if (userCredits < creditsNeeded) {
      toast({
        title: "Insufficient credits",
        description: `You need ${creditsNeeded} credits but only have ${userCredits}. Please buy more credits.`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setSelectedAmount(amount)

    try {
      console.log("[v0] Top-up request:", { cardId, amount, creditsNeeded, userCredits })

      const response = await fetch("/api/cards/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Top-up failed")
      }

      toast({
        title: "Top-up successful",
        description: `Added $${amount} to your card. ${creditsNeeded} credits deducted.`,
      })

      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("[v0] Top-up failed:", error)
      toast({
        title: "Top-up failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setSelectedAmount(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start">
          <Plus className="w-4 h-4 mr-2" />
          Top Up Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Top Up Card with Credits
          </DialogTitle>
          <DialogDescription>Use your credits to add funds to this card</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Your Credits</span>
              </div>
              <span className="text-2xl font-bold text-primary">{userCredits}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Each credit = $15 | Total value: ${(userCredits * 15).toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Select Top-Up Amount</p>
            <div className="grid grid-cols-2 gap-3">
              {TOPUP_AMOUNTS.map(({ amount, credits }) => {
                const hasEnoughCredits = userCredits >= credits
                const isSelected = selectedAmount === amount

                return (
                  <Button
                    key={amount}
                    type="button"
                    variant={hasEnoughCredits ? "outline" : "ghost"}
                    disabled={!hasEnoughCredits || loading}
                    onClick={() => handleTopUp(amount, credits)}
                    className={`h-auto py-4 flex flex-col items-center gap-1 ${
                      hasEnoughCredits ? "hover:bg-primary/10 hover:border-primary" : "opacity-50 cursor-not-allowed"
                    } ${isSelected && loading ? "bg-primary/10 border-primary" : ""}`}
                  >
                    {isSelected && loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span className="text-xl font-bold">${amount}</span>
                        <span className="text-xs text-muted-foreground">
                          {credits} credit{credits > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          <Alert className="bg-muted/50 border-border">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Credits will be deducted from your account and the selected amount will be added to your card instantly.
              {userCredits === 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  You have no credits. Please buy credits first.
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
