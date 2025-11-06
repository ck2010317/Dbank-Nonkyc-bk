import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Plus, History, Wallet, Shield, Zap, ArrowRight, Lock, Globe } from "lucide-react"
import { ThreeDCardShowcase } from "@/components/3d-card-showcase"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">dbank</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/preload-cards"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Preload Cards
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://t.me/dbank_insiders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              aria-label="Telegram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </a>
            <a
              href="https://x.com/official_dbank"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              aria-label="X (Twitter)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>
            <Link href="/dashboard">
              <Button className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6 backdrop-blur-sm">
            <Shield className="w-4 h-4" />
            <span>Non-KYC Cards • Privacy First</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance tracking-tight">
            Digital Banking
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Without Limits
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty max-w-3xl mx-auto leading-relaxed">
            Create and manage virtual prepaid cards instantly. No identity verification, no paperwork, just seamless
            digital payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-8 py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your Card
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base px-8 py-6 bg-transparent border-2"
              >
                Explore Features
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Instant Issuance</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Global Acceptance</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Card Showcase Section */}
      <ThreeDCardShowcase />

      <section id="features" className="container mx-auto px-4 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Everything You Need</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Powerful features designed for modern digital payments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-card border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Instant Card Creation</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Create virtual prepaid cards in seconds. No KYC required - just email and phone number
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border/50 hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 group">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">
                <Wallet className="w-7 h-7 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Flexible Top-ups</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Add funds using multiple currencies including USDT, BTC, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Privacy & Security</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Non-KYC cards with instant freeze/unfreeze controls for complete security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border/50 hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 group">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">
                <History className="w-7 h-7 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Transaction History</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Track all transactions with detailed history and filtering options
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Real-time Updates</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Get instant notifications for all card activities and balance changes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border/50 hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 group">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Multi-card Management</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Manage multiple cards from a single dashboard with ease
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border-primary/20 shadow-2xl">
          <CardContent className="p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to Get Started?</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users managing their digital cards with dbank
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="text-base px-8 py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Card
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <CreditCard className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">dbank</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 dbank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
