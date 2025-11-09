"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Copy, CreditCard, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BuyCreditsPage() {
  const [transactionHash, setTransactionHash] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USDT")
  const [network, setNetwork] = useState("ETHEREUM")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const WALLET_ADDRESS = "0x46278303c6ffe76eda245d5e6c4cf668231f73a2"

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS)
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionHash,
          amount: Number.parseFloat(amount),
          currency,
          network,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify payment")
      }

      setSuccess(true)
      toast({
        title: "Payment verified!",
        description: `${data.creditsAdded} credits have been added to your account`,
      })

      // Reset form
      setTransactionHash("")
      setAmount("")
    } catch (error) {
      console.log("[v0] Error caught:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Please check your transaction details and try again"
      console.log("[v0] Showing toast with message:", errorMessage)

      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateCredits = (amt: string) => {
    const numAmount = Number.parseFloat(amt)
    if (isNaN(numAmount) || numAmount < 30) return 0
    return Math.floor(numAmount / 30)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold">Buy Credits</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Instructions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Payment Instructions</CardTitle>
              <CardDescription>Follow these steps to purchase credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Step 1: Send Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Send USDT or USDC on Ethereum (ETH) or Base network to the wallet address below. Each credit costs
                  $30.
                </p>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <Label className="text-xs text-muted-foreground">Wallet Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs font-mono flex-1 break-all">{WALLET_ADDRESS}</code>
                    <Button size="sm" variant="ghost" onClick={handleCopyAddress}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Step 2: Get Transaction Hash</h3>
                <p className="text-sm text-muted-foreground">
                  After sending, copy the transaction hash from your wallet or block explorer.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Step 3: Submit Details</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the form with your transaction details. Credits will be added automatically after blockchain
                  verification.
                </p>
              </div>

              <Alert className="border-blue-500/50 bg-blue-500/10">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-500">Pricing</AlertTitle>
                <AlertDescription className="text-sm text-blue-400">
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>1 Credit = $30 USDT/USDC = 1 Card</li>
                    <li>5 Credits = $150 USDT/USDC = 5 Cards</li>
                    <li>10 Credits = $300 USDT/USDC = 10 Cards</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Submission Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Submit Payment</CardTitle>
              <CardDescription>Enter your transaction details</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-500">Payment Verified!</AlertTitle>
                  <AlertDescription className="text-sm text-green-400">
                    Your credits have been added successfully. You can now create cards.
                  </AlertDescription>
                  <Button className="mt-4 w-full" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="network">Network</Label>
                    <Select value={network} onValueChange={setNetwork}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETHEREUM">Ethereum (ETH)</SelectItem>
                        <SelectItem value="BASE">Base Chain</SelectItem>
                        <SelectItem value="BSC">Binance Smart Chain (BSC)</SelectItem>
                        <SelectItem value="POLYGON">Polygon (MATIC)</SelectItem>
                        <SelectItem value="TRON">Tron (TRX)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDT">USDT (Tether)</SelectItem>
                        <SelectItem value="USDC">USDC (USD Coin)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="30"
                      placeholder="30.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="bg-background border-border"
                    />
                    {amount && Number.parseFloat(amount) >= 30 && (
                      <p className="text-xs text-muted-foreground">
                        You will receive {calculateCredits(amount)} credits
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="txHash">Transaction Hash</Label>
                    <Input
                      id="txHash"
                      type="text"
                      placeholder="0x..."
                      value={transactionHash}
                      onChange={(e) => setTransactionHash(e.target.value)}
                      required
                      className="bg-background border-border font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Copy from your wallet or block explorer (e.g., BscScan, Etherscan)
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || !transactionHash || !amount}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Submit Payment"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
