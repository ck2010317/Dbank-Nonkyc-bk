"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CardVisual } from "@/components/card-visual"
import { zeroidApi, type Card as CardType, type Transaction, type SensitiveCardDetails } from "@/lib/zeroid-api"
import {
  CreditCard,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Lock,
  Unlock,
  History,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { TopUpDialog } from "@/components/top-up-dialog"

export default function CardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const cardId = params.id as string

  const [card, setCard] = useState<CardType | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [sensitiveDetails, setSensitiveDetails] = useState<SensitiveCardDetails | null>(null)
  const [loadingSensitive, setLoadingSensitive] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const loadCardData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }
      setError(null)
      const [cardData, transactionsData] = await Promise.all([
        zeroidApi.getCard(cardId),
        zeroidApi.getTransactions(cardId),
      ])
      setCard(cardData)
      setTransactions(Array.isArray(transactionsData) ? transactionsData : [])
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load card data")
    } finally {
      if (!silent) {
        setLoading(false)
      }
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadCardData()
  }, [cardId])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true)
      loadCardData(true) // Silent refresh (no loading spinner)
    }, 15000) // Refresh every 15 seconds

    return () => clearInterval(interval)
  }, [cardId])

  const handleManualRefresh = () => {
    setIsRefreshing(true)
    loadCardData(true)
  }

  const handleFreezeToggle = async () => {
    if (!card) return

    try {
      setActionLoading(true)
      if (card.status === "active") {
        await zeroidApi.freezeCard(cardId)
      } else {
        await zeroidApi.unfreezeCard(cardId)
      }
      await loadCardData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update card status")
    } finally {
      setActionLoading(false)
    }
  }

  const toggleCardDetails = async () => {
    if (!showCardDetails && !sensitiveDetails) {
      try {
        setLoadingSensitive(true)
        const details = await zeroidApi.getCardSensitiveDetails(cardId)
        setSensitiveDetails(details)
        setShowCardDetails(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sensitive card details")
      } finally {
        setLoadingSensitive(false)
      }
    } else {
      setShowCardDetails(!showCardDetails)
    }
  }

  const getCardNumber = () => {
    if (!card) return "•••• •••• •••• ••••"
    if (showCardDetails && sensitiveDetails?.card_number) {
      const cardNum = sensitiveDetails.card_number
      return cardNum.replace(/(\d{4})(?=\d)/g, "$1 ")
    }
    if (showCardDetails && card.last4) {
      return `•••• •••• •••• ${card.last4}`
    }
    return "•••• •••• •••• ••••"
  }

  const getExpiryDate = () => {
    if (!card) return "••/••"
    if (showCardDetails && sensitiveDetails?.expiry_date) {
      return sensitiveDetails.expiry_date
    }
    if (showCardDetails && card.expiration_date_short) {
      return card.expiration_date_short
    }
    return "••/••"
  }

  const getCVV = () => {
    if (showCardDetails && sensitiveDetails?.cvv) {
      return sensitiveDetails.cvv
    }
    return "•••"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Card not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 5) : []

  console.log("[v0] Total transactions:", transactions.length)
  console.log(
    "[v0] All transactions:",
    transactions.map((t) => ({
      id: t.id,
      description: t.description,
      type: t.type,
      status: t.status,
      amount: t.amount,
    })),
  )

  const totalSpent = Array.isArray(transactions)
    ? transactions
        .filter((t) => t.type === "debit" && (t.status === "COMPLETED" || t.status === "PENDING"))
        .reduce((sum, t) => sum + t.amount, 0)
    : 0

  console.log(
    "[v0] Debit transactions:",
    transactions.filter((t) => t.type === "debit" && (t.status === "COMPLETED" || t.status === "PENDING")).length,
  )
  console.log(
    "[v0] Credit transactions:",
    transactions.filter((t) => t.type === "credit" && (t.status === "COMPLETED" || t.status === "PENDING")).length,
  )
  console.log("[v0] Total Spent:", totalSpent)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">dbank</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleManualRefresh} disabled={isRefreshing} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {isRefreshing && (
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-2">
            <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Checking for balance updates...
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Card Visual and Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-4">
                <CardVisual
                  cardNumber={getCardNumber()}
                  expiryDate={getExpiryDate()}
                  cvv={getCVV()}
                  holderName={card.title || "Card Holder"}
                  balance={card.balance || 0}
                  status={card.status as "active" | "frozen"}
                />
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={toggleCardDetails}
                  disabled={loadingSensitive}
                >
                  {loadingSensitive ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading Details...
                    </>
                  ) : showCardDetails ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Card Details
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show Card Details
                    </>
                  )}
                </Button>
                {showCardDetails && !sensitiveDetails && (
                  <p className="text-xs text-muted-foreground text-center">
                    Only the last 4 digits are available. Full card details could not be loaded.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Cards are funded from the main ZeroID account balance when created */}
                <TopUpDialog cardId={cardId} onSuccess={loadCardData} />
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleFreezeToggle}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : card.status === "active" ? (
                    <Lock className="w-4 h-4 mr-2" />
                  ) : (
                    <Unlock className="w-4 h-4 mr-2" />
                  )}
                  {card.status === "active" ? "Freeze Card" : "Unfreeze Card"}
                </Button>
                <Link href={`/dashboard/cards/${cardId}/transactions`} className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <History className="w-4 h-4 mr-2" />
                    View All Transactions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={card.status === "active" ? "default" : "destructive"}>
                    {card.status?.toUpperCase() || "UNKNOWN"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Card Title</span>
                  <span className="text-sm font-medium">{card.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Brand</span>
                  <span className="text-sm font-medium">{card.brand}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Currency</span>
                  <span className="text-sm font-medium">{card.currency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">{card.form_factor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(card.createdAt || card.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Last updated</span>
                  <span className="text-xs text-muted-foreground">{lastRefresh.toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(card.balance || 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Available to spend</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">${totalSpent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest card activity</CardDescription>
                  </div>
                  <Link href={`/dashboard/cards/${cardId}/transactions`}>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === "credit"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {transaction.type === "credit" ? (
                              <TrendingUp className="w-5 h-5" />
                            ) : (
                              <TrendingDown className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{transaction.description}</p>
                              {transaction.status && (
                                <Badge
                                  variant={
                                    transaction.status === "COMPLETED"
                                      ? "default"
                                      : transaction.status === "DECLINED"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className={
                                    transaction.status === "COMPLETED"
                                      ? "bg-green-500 hover:bg-green-600"
                                      : transaction.status === "DECLINED"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-gray-500 hover:bg-gray-600"
                                  }
                                >
                                  {transaction.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${transaction.type === "credit" ? "text-green-500" : "text-destructive"}`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.currency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
