"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, DollarSign, Users } from "lucide-react"

interface Stats {
  totalCards: number
  totalDeposits: number
  activeUsers: number
  totalCredits: number
}

export function LiveStats() {
  const [stats, setStats] = useState<Stats>({
    totalCards: 0,
    totalDeposits: 0,
    activeUsers: 0,
    totalCredits: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const statCards = [
    {
      title: "Cards Created",
      value: formatNumber(stats.totalCards),
      icon: CreditCard,
      gradient: "from-primary to-blue-600",
    },
    {
      title: "Total Deposits",
      value: `$${formatNumber(stats.totalDeposits)}`,
      icon: DollarSign,
      gradient: "from-green-600 to-emerald-600",
    },
    {
      title: "Active Users",
      value: formatNumber(stats.activeUsers),
      icon: Users,
      gradient: "from-purple-600 to-pink-600",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20 relative">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span>Live Statistics</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Real-Time Platform Stats</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          See how dbank is growing in real-time with instant updates
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
              />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {loading && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <div className="text-3xl font-bold mb-1 text-balance">{loading ? "..." : stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Updates every 30 seconds
          </span>
        </p>
      </div>
    </section>
  )
}
