import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CreditCard,
  Plus,
  History,
  Wallet,
  Shield,
  Zap,
  ArrowRight,
  ShoppingBag,
  Smartphone,
  Globe,
} from "lucide-react"
// Importing 3D card showcase component
import { ThreeDCardShowcase } from "@/components/3d-card-showcase"
import { LiveStats } from "@/components/live-stats"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/dbank-logo.svg" alt="dbank" className="h-8 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/preload-cards"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Preload Cards
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://t.me/dbank_insiders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
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
              className="text-muted-foreground hover:text-foreground transition-colors"
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
              <Button className="shadow-lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium mb-3">
            <Shield className="w-4 h-4" />
            <span>Non-KYC Cards • No Identity Verification Required</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Instant Card Issuance</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Digital Banking Made{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simple
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Create, manage, and control prepaid cards instantly. Perfect for businesses and individuals who need
            flexible payment solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow group">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Card
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background/50 backdrop-blur">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3D Card Showcase Section */}
      <ThreeDCardShowcase />

      {/* LiveStats Component */}
      <LiveStats />

      {/* Pricing & Fees Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No hidden fees. Know exactly what you pay for every transaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {/* Card Top-up Fee */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">Card Top-up Fee</CardTitle>
                  <CardDescription>One-time fee when adding funds to your card</CardDescription>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-1">2.5% + 1 USDT</div>
              <p className="text-sm text-muted-foreground">Per top-up transaction</p>
            </CardContent>
          </Card>

          {/* Domestic Transaction */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">Domestic Transaction</CardTitle>
                  <CardDescription>Fee for purchases within your country</CardDescription>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-1">$0.35</div>
              <p className="text-sm text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          {/* International Transaction */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">International Transaction</CardTitle>
                  <CardDescription>Fee for cross-border purchases</CardDescription>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-1">2% + $0.30</div>
              <p className="text-sm text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          {/* Transaction Limits */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">Transaction Limits</CardTitle>
                  <CardDescription>Maximum spending limits for your security</CardDescription>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">$200,000</div>
                  <p className="text-sm text-muted-foreground">Per transaction</p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">$500,000</div>
                  <p className="text-sm text-muted-foreground">Daily limit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases Section with Images */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Your Cards Anywhere</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Shop online, pay in stores, or subscribe to services - your dbank card works everywhere
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Online Shopping */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src="/person-shopping-online-on-laptop-with-credit-card-.jpg"
                alt="Online Shopping"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-primary/90 backdrop-blur rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">Online Shopping</h3>
                <p className="text-white/80 text-sm">Shop from thousands of online stores worldwide</p>
              </div>
            </div>
          </div>

          {/* In-Store Payments */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src="/person-paying-with-phone-contactless-payment-in-mo.jpg"
                alt="In-Store Payments"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-blue-600/90 backdrop-blur rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">In-Store Purchases</h3>
                <p className="text-white/80 text-sm">Tap to pay at millions of retail locations</p>
              </div>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src="/person-using-streaming-services-on-tablet--multipl.jpg"
                alt="Subscriptions"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-purple-600/90 backdrop-blur rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">Subscriptions</h3>
                <p className="text-white/80 text-sm">Manage all your recurring payments effortlessly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose dbank?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the future of digital banking with instant cards and complete privacy
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Privacy First */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img
                src="/person-using-laptop-with-secure-lock-icon-privacy-.jpg"
                alt="Privacy and Security"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-600/90 backdrop-blur rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Privacy First Banking</h3>
                <p className="text-white/90 text-base">
                  No KYC required. Your privacy is our priority with instant non-KYC virtual cards
                </p>
              </div>
            </div>
          </div>

          {/* Instant Setup */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img
                src="/person-holding-smartphone-with-credit-card-creatio.jpg"
                alt="Instant Card Creation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/90 backdrop-blur rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Cards in Seconds</h3>
                <p className="text-white/90 text-base">
                  Create your virtual card instantly - no waiting, no paperwork, just instant access
                </p>
              </div>
            </div>
          </div>

          {/* Global Acceptance */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img
                src="/world-map-with-payment-locations-global-acceptance.jpg"
                alt="Global Acceptance"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600/90 backdrop-blur rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Accepted Worldwide</h3>
                <p className="text-white/90 text-base">
                  Use your dbank card anywhere Visa and Mastercard are accepted globally
                </p>
              </div>
            </div>
          </div>

          {/* Easy Top-ups */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img
                src="/crypto-wallet-bitcoin-ethereum-digital-currency-pa.jpg"
                alt="Flexible Payment Options"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-600/90 backdrop-blur rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Flexible Top-ups</h3>
                <p className="text-white/90 text-base">
                  Add funds with USDT, USDC, and other cryptocurrencies on multiple networks
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features to manage your digital cards with complete control and security
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">Instant Card Creation</CardTitle>
              <CardDescription>
                Create virtual prepaid cards in seconds. No KYC required - just email and phone number
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">Flexible Top-ups</CardTitle>
              <CardDescription>Add funds using multiple currencies including USDT, BTC, and more</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">Privacy & Security</CardTitle>
              <CardDescription>
                Non-KYC cards with instant freeze/unfreeze controls for complete security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <History className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">Transaction History</CardTitle>
              <CardDescription>Track all transactions with detailed history and filtering options</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">Real-time Updates</CardTitle>
              <CardDescription>Get instant notifications for all card activities and balance changes</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">Multi-card Management</CardTitle>
              <CardDescription>Manage multiple cards from a single dashboard with ease</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <Card className="bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/10 border-primary/20 backdrop-blur overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users managing their digital cards with dbank
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="shadow-lg group">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Card
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/dbank-logo.svg" alt="dbank" className="h-6 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">© 2025 dbank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
