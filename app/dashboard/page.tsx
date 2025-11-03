"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreateCardDialog } from "@/components/create-card-dialog"
import { CardVisual } from "@/components/card-visual"
import { zeroidApi, type Card as CardType } from "@/lib/zeroid-api"
import { CreditCard, ArrowUpRight, Loader2, AlertCircle, Info, Coins, LogOut, Plus, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function DashboardPage() {
  const [cards, setCards] = useState<CardType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [userEmail, setUserEmail] = useState<string>("")
  const [loadingUser, setLoadingUser] = useState(true)
  const [databaseSetup, setDatabaseSetup] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const loadUserProfile = async () => {
    if (typeof window === "undefined" || !mounted) {
      return
    }

    try {
      setLoadingUser(true)
      const supabase = createClient()

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error("[v0] Auth error:", authError.message)
        router.push("/auth/login")
        return
      }

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserEmail(user.email || "")

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single()

      if (profileError) {
        if (profileError.message.includes("Could not find the table") || profileError.code === "PGRST205") {
          setDatabaseSetup(false)
          setCredits(999)
        } else if (profileError.code === "PGRST116") {
          console.log("[v0] No profile found, creating one via API...")
          const response = await fetch("/api/user/profile/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, email: user.email }),
          })

          if (response.ok) {
            console.log("[v0] Profile created successfully")
            setCredits(0)
            setDatabaseSetup(true)
          } else {
            const errorData = await response.json()
            console.error("[v0] Error creating profile:", errorData.error)
            setCredits(0)
            setDatabaseSetup(true)
          }
        } else {
          console.error("[v0] Error loading profile:", profileError.message)
          setCredits(0)
        }
      } else {
        setDatabaseSetup(true)
        setCredits(profile?.credits || 0)
      }
    } catch (err) {
      setDatabaseSetup(false)
      setCredits(999)
    } finally {
      setLoadingUser(false)
    }
  }

  const loadCards = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await zeroidApi.getCards()
      const cardsArray = Array.isArray(data) ? data : []
      setCards(cardsArray)
    } catch (err) {
      console.error("[v0] Error loading cards:", err)
      setError(err instanceof Error ? err.message : "Failed to load cards")
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await createClient().auth.signOut()
    router.push("/auth/login")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadUserProfile()
      loadCards()
    }
  }, [mounted])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">dbank</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground hidden sm:block">{userEmail}</div>
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <a href="https://t.me/dbank_insiders" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <TelegramIcon className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <a href="https://x.com/official_dbank" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <XIcon className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/preload-cards">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Preload Cards
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/buy-credits">
                <Plus className="w-4 h-4 mr-2" />
                Buy Credits
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <CreateCardDialog
              onCardCreated={() => {
                loadCards()
                loadUserProfile()
              }}
              userCredits={credits}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!databaseSetup && (
          <Alert className="mb-6 border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertTitle className="text-orange-500">Database Setup Required</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              The profiles table hasn't been created yet. To enable the credit system:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Go to your Supabase project dashboard</li>
                <li>Click "SQL Editor" in the left sidebar</li>
                <li>
                  Copy the contents of{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">scripts/001_create_profiles.sql</code>
                </li>
                <li>Paste and click "Run"</li>
              </ol>
              <p className="mt-2 text-xs">For now, you can test card creation without credit restrictions.</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Your Credits</CardTitle>
              <Coins className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loadingUser ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">{databaseSetup ? credits : "∞"}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {databaseSetup
                      ? credits === 1
                        ? "1 card available"
                        : `${credits} cards available`
                      : "Testing mode - unlimited cards"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Cards</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cards.filter((c) => c.status === "active").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to use</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cards</CardTitle>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cards.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {!loadingUser && credits === 0 && databaseSetup && (
          <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-500">No Credits Available</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              You need credits to create cards. Each card costs 1 credit ($35 USDT/USDC).
              <div className="mt-3">
                <Button size="sm" asChild>
                  <Link href="/buy-credits">
                    <Plus className="w-4 h-4 mr-2" />
                    Buy Credits Now
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          {cards.length === 0 && !loading && credits > 0 && (
            <Alert className="mb-6 border-blue-500/50 bg-blue-500/10">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-500">Getting Started</AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground">
                You have {credits} {credits === 1 ? "credit" : "credits"} available. Create your first card to get
                started!
              </AlertDescription>
            </Alert>
          )}

          {cards.length === 0 && !loading && credits === 0 && (
            <Alert className="mb-6 border-blue-500/50 bg-blue-500/10">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-500">No Cards Yet</AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground">
                You need credits to create cards. Each card costs 1 credit ($35 USDT/USDC).
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Contact the admin to purchase credits</li>
                  <li>Send payment via USDT/USDC</li>
                  <li>Credits will be added to your account after payment confirmation</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Your Cards</h2>
              <p className="text-muted-foreground">Manage and view all your prepaid cards</p>
            </div>
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
          ) : cards.length === 0 ? (
            <Card className="bg-card border-border border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No cards yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Create your first card to start managing your digital payments
                </p>
                <CreateCardDialog
                  onCardCreated={() => {
                    loadCards()
                    loadUserProfile()
                  }}
                  userCredits={credits}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Link key={card.id} href={`/dashboard/cards/${card.id}`}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <CardVisual
                          cardNumber={card.last4 ? `**** **** **** ${card.last4}` : undefined}
                          expiryDate={card.expiration_date_short || card.expiryDate}
                          cvv={card.cvv}
                          holderName={card.title || "Card Holder"}
                          balance={card.balance}
                          status={card.status}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Card Number</span>
                          <span className="text-sm font-medium">**** {card.last4 || "****"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Brand</span>
                          <span className="text-sm font-medium">{card.brand || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Expires</span>
                          <span className="text-sm font-medium">{card.expiration_date_short || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <span
                            className={`text-sm font-medium uppercase ${card.status?.toLowerCase() === "active" ? "text-green-500" : "text-destructive"}`}
                          >
                            {card.status || "UNKNOWN"}
                          </span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
