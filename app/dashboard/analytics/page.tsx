"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { zeroidApi, type Card as CardType, type Transaction } from "@/lib/zeroid-api"
import { CreditCard, Loader2, AlertCircle, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell } from "recharts"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function AnalyticsPage() {
  const [cards, setCards] = useState<CardType[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserEmail(user.email || "")

      // Load all cards
      const cardsData = await zeroidApi.getCards()
      const cardsArray = Array.isArray(cardsData) ? cardsData : []
      setCards(cardsArray)

      // Load transactions for all cards
      const allTransactions: Transaction[] = []
      for (const card of cardsArray) {
        try {
          const cardTransactions = await zeroidApi.getTransactions(card.id)
          allTransactions.push(...cardTransactions)
        } catch (err) {
          console.error(`Failed to load transactions for card ${card.id}:`, err)
        }
      }
      setTransactions(allTransactions)
    } catch (err) {
      console.error("[v0] Error loading data:", err)
      setError(err instanceof Error ? err.message : "Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await createClient().auth.signOut()
    router.push("/auth/login")
  }

  // Calculate monthly spending
  const monthlyData = transactions.reduce(
    (acc, txn) => {
      const date = new Date(txn.timestamp)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, spent: 0, received: 0 }
      }

      if (txn.type === "debit" && (txn.status === "COMPLETED" || txn.status === "PENDING")) {
        acc[monthKey].spent += txn.amount
      } else if (txn.type === "credit" && (txn.status === "COMPLETED" || txn.status === "PENDING")) {
        acc[monthKey].received += txn.amount
      }

      return acc
    },
    {} as Record<string, { month: string; spent: number; received: number }>,
  )

  const monthlyChartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Last 6 months
    .map((item) => ({
      month: new Date(item.month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      spent: Number(item.spent.toFixed(2)),
      received: Number(item.received.toFixed(2)),
    }))

  // Calculate category breakdown (mock categories based on description)
  const categoryData = transactions
    .filter((txn) => txn.type === "debit" && (txn.status === "COMPLETED" || txn.status === "PENDING"))
    .reduce(
      (acc, txn) => {
        const desc = txn.description.toLowerCase()
        let category = "Other"

        if (desc.includes("restaurant") || desc.includes("food") || desc.includes("cafe")) {
          category = "Food & Dining"
        } else if (
          desc.includes("gas") ||
          desc.includes("fuel") ||
          desc.includes("uber") ||
          desc.includes("transport")
        ) {
          category = "Transportation"
        } else if (desc.includes("shop") || desc.includes("store") || desc.includes("retail")) {
          category = "Shopping"
        } else if (desc.includes("subscription") || desc.includes("netflix") || desc.includes("spotify")) {
          category = "Subscriptions"
        } else if (desc.includes("hotel") || desc.includes("flight") || desc.includes("travel")) {
          category = "Travel"
        }

        acc[category] = (acc[category] || 0) + txn.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const categoryChartData = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value)

  // Calculate stats
  const totalSpent = transactions
    .filter((t) => t.type === "debit" && (t.status === "COMPLETED" || t.status === "PENDING"))
    .reduce((sum, t) => sum + t.amount, 0)

  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const currentMonthSpent = transactions
    .filter((t) => {
      const txnDate = new Date(t.timestamp)
      const now = new Date()
      return (
        t.type === "debit" &&
        (t.status === "COMPLETED" || t.status === "PENDING") &&
        txnDate.getMonth() === now.getMonth() &&
        txnDate.getFullYear() === now.getFullYear()
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const avgMonthlySpending =
    monthlyChartData.length > 0
      ? monthlyChartData.reduce((sum, item) => sum + item.spent, 0) / monthlyChartData.length
      : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">dbank</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground hidden md:block">{userEmail}</div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/tokenomics">Tokenomics</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <TrendingDown className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Spending Analytics</h1>
          <p className="text-muted-foreground">Monthly reports and spending insights across all your cards</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : transactions.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No transaction data available yet. Start using your cards to see analytics.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {currentMonth}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">${currentMonthSpent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">This month's spending</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Avg Monthly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">${avgMonthlySpending.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Average per month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">${totalSpent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time spending</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Spending Trend */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Monthly Spending Trend</CardTitle>
                  <CardDescription>Your spending and credits over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      spent: { label: "Spent", color: "#ef4444" },
                      received: { label: "Received", color: "#10b981" },
                    }}
                    className="h-[300px]"
                  >
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="spent" fill="var(--color-spent)" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="received" fill="var(--color-received)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>Where your money goes</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryChartData.length > 0 ? (
                    <ChartContainer
                      config={{
                        value: { label: "Amount", color: "#3b82f6" },
                      }}
                      className="h-[300px]"
                    >
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => `${entry.name}: $${entry.value}`}
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No category data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Category Details Table */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Detailed spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryChartData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {((category.value / totalSpent) * 100).toFixed(1)}% of total spending
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold">${category.value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
