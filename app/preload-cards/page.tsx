"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, ShoppingCart, CheckCircle2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface PreloadCard {
  id: string
  card_number: string
  cardholder_name: string
  expiry_date: string
  balance: number
  price: number
  created_at: string
}

export default function PreloadCardsPage() {
  const [cards, setCards] = useState<PreloadCard[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [selectedCard, setSelectedCard] = useState<PreloadCard | null>(null)
  const [transactionHash, setTransactionHash] = useState("")
  const { toast } = useToast()

  const PAYMENT_ADDRESS = "0x46278303c6ffe76eda245d5e6c4cf668231f73a2"

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch("/api/preload-cards")
      const data = await response.json()

      if (response.ok) {
        setCards(data.cards)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to load cards",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load preload cards",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!selectedCard || !transactionHash) {
      toast({
        title: "Missing information",
        description: "Please enter your transaction hash",
        variant: "destructive",
      })
      return
    }

    setPurchasing(true)

    try {
      const response = await fetch("/api/preload-cards/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preloadCardId: selectedCard.id,
          transactionHash: transactionHash.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Purchase successful!",
          description: "The card has been added to your account",
        })
        setSelectedCard(null)
        setTransactionHash("")
        fetchCards()
      } else {
        toast({
          title: "Purchase failed",
          description: data.error || "Failed to purchase card",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process purchase",
        variant: "destructive",
      })
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Preload Cards</h1>
        <p className="text-muted-foreground">Purchase ready-to-use virtual cards with preloaded balance</p>
      </div>

      {selectedCard ? (
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Purchase</CardTitle>
              <CardDescription>Send ${selectedCard.price} to receive your preloaded card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                <div className="mb-2 flex items-center justify-between">
                  <CreditCard className="h-8 w-8" />
                  <span className="text-3xl font-bold">${selectedCard.balance.toFixed(2)}</span>
                </div>
                <p className="text-sm text-white/80">Preloaded Virtual Card</p>
                <p className="mt-4 text-xs text-white/60">Card details will be revealed after payment verification</p>
              </div>

              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Payment Instructions:</p>
                    <ol className="ml-4 list-decimal space-y-1 text-sm">
                      <li>Send exactly ${selectedCard.price} worth of ETH to the address below on Base network</li>
                      <li>Copy your transaction hash after sending</li>
                      <li>Paste the transaction hash below and click "Verify Payment"</li>
                      <li>After verification, the card will be added to your account</li>
                    </ol>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Payment Address (Base Network)</Label>
                <div className="flex gap-2">
                  <Input value={PAYMENT_ADDRESS} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(PAYMENT_ADDRESS)
                      toast({ title: "Copied!", description: "Address copied to clipboard" })
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Send payment to this address on Base network</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="txHash">Transaction Hash</Label>
                <Input
                  id="txHash"
                  placeholder="0x..."
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the transaction hash from your wallet after sending the payment
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedCard(null)} disabled={purchasing}>
                Cancel
              </Button>
              <Button onClick={handlePurchase} disabled={purchasing || !transactionHash} className="flex-1">
                {purchasing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Verify Payment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <>
          {cards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">No preload cards available</p>
                <p className="text-sm text-muted-foreground">Check back later for new cards</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <Card key={card.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                      <CreditCard className="h-8 w-8" />
                      <span className="text-3xl font-bold">${card.balance.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-white/80">Preloaded Balance</p>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted p-4">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">What you get:</p>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Virtual card with ${card.balance.toFixed(2)} balance
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Ready to use immediately
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Full card details after purchase
                          </li>
                        </ul>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-sm font-medium">Price</span>
                        <span className="text-2xl font-bold">${card.price}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => setSelectedCard(card)} className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/dashboard">
              <Button variant="outline">View My Cards</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
