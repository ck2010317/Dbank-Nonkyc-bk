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
  Coins,
  TrendingUp,
} from "lucide-react"
// Importing 3D card showcase component
import { ThreeDCardShowcase } from "@/components/3d-card-showcase"
import { LiveStats } from "@/components/live-stats"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/8 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header - Enhanced navbar with glassmorphism, better spacing, and hover effects */}
      <header className="border-b border-blue-100/50 bg-white/70 backdrop-blur-2xl sticky top-0 z-50 shadow-lg shadow-blue-100/20">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <img
                  src="/dbank-logo.svg"
                  alt="dbank"
                  className="h-10 w-auto relative z-10 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="#features"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
              >
                How it Works
              </Link>
              <Link
                href="#tokenomics"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
              >
                Tokenomics
              </Link>
              <Link
                href="/preload-cards"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
              >
                Preload Cards
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
              >
                Dashboard
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Social Links */}
              <div className="hidden sm:flex items-center gap-2">
                <a
                  href="https://t.me/dbank_insiders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
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
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
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
              </div>

              {/* CTA Button */}
              <Link href="/dashboard">
                <Button className="shadow-lg hover:shadow-xl hover:shadow-blue-200/50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-3">
            <Shield className="w-4 h-4" />
            <span>Non-KYC Cards • No Identity Verification Required</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Instant Card Issuance</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance text-gray-900">
            Digital Banking Made{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
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
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What is dbank.finance Section */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">What is dbank.finance?</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your gateway to instant, secure, and anonymous virtual prepaid cards
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Future of Digital Payments</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                dbank.finance is a revolutionary digital banking platform that allows you to create instant virtual
                prepaid cards without any identity verification or KYC requirements. We believe in financial privacy and
                accessibility, enabling anyone from anywhere in the world to access secure payment solutions within
                minutes.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Unlike traditional banks that require extensive documentation, waiting periods, and personal
                information, dbank.finance operates on a simple principle: deposit cryptocurrency, create your card, and
                start spending immediately. No questions asked, no paperwork required, and complete control over your
                financial privacy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our platform bridges the gap between cryptocurrency and everyday spending. Whether you're a crypto
                enthusiast looking to spend your digital assets, a business owner needing flexible payment solutions for
                your team, or someone who values financial privacy, dbank.finance provides the tools you need to manage
                your money on your terms.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 shadow-lg border border-blue-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How Virtual Cards Work</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Virtual prepaid cards are digital versions of traditional debit or credit cards that exist entirely
                online. Each card comes with its own unique card number, expiration date, and CVV security code, just
                like a physical card. The key difference is that everything happens instantly in the digital realm - no
                waiting for mail delivery, no physical plastic, and no geographical limitations.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you create a card on dbank.finance, our system instantly generates a valid VISA card that's ready
                to use for online purchases, subscription services, and any merchant that accepts card payments. You can
                fund your card using cryptocurrency (Ethereum, Base, or TON), and the balance is immediately available
                for spending.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Each card operates independently with its own balance and transaction history. You can create multiple
                cards for different purposes - one for subscriptions, another for shopping, and another for business
                expenses. This compartmentalization helps you track spending, manage budgets, and maintain control over
                your finances without mixing transactions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The beauty of virtual cards lies in their flexibility and security. If a card is compromised or you no
                longer need it, simply freeze or delete it without affecting your other cards. You can also set custom
                limits, monitor transactions in real-time, and receive instant notifications for every purchase - giving
                you unprecedented control over your spending.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security & Privacy First</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                At dbank.finance, we take your security and privacy seriously. Our platform is built on
                industry-standard encryption protocols that protect your transactions and personal data. Every
                transaction is processed through secure channels with end-to-end encryption, ensuring that your
                financial information remains confidential and protected from unauthorized access.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Unlike traditional banking systems that store extensive personal information, we operate on a
                privacy-first model. We don't require or store sensitive identity documents, social security numbers, or
                personal addresses. Your account is secured with modern authentication methods, and you maintain
                complete anonymity while using our services.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our card issuance process is powered by blockchain technology, which provides transparent and immutable
                transaction records. When you deposit cryptocurrency to fund your cards, the transaction is verified on
                the blockchain, ensuring complete transparency and security. You can always verify your deposits by
                checking the transaction hash on the blockchain explorer.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We also implement strict fraud prevention measures to protect your accounts. Real-time transaction
                monitoring, suspicious activity alerts, and customizable spending limits work together to keep your
                funds safe. If any unusual activity is detected, you'll be notified immediately, and you can take action
                by freezing or locking your cards with a single click.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 shadow-lg border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Supported Networks & Currencies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                dbank.finance supports multiple blockchain networks to give you maximum flexibility in funding your
                cards. We accept deposits through Ethereum (ERC-20), Base Chain, and TON Network, allowing you to use
                the blockchain that best suits your needs in terms of transaction speed and fees.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong className="text-gray-900">Ethereum Network:</strong> The most established and widely-used
                blockchain network. Ethereum offers the highest security and liquidity, making it ideal for larger
                transactions. While transaction fees can be higher during peak network congestion, Ethereum provides the
                most reliable and battle-tested infrastructure for your deposits.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong className="text-gray-900">Base Chain:</strong> A Layer 2 solution built on Ethereum that offers
                significantly lower transaction fees while maintaining the security of the Ethereum network. Base is
                perfect for frequent deposits and smaller transactions, as you'll save on gas fees without compromising
                security or speed.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong className="text-gray-900">TON Network:</strong> The Open Network (TON) provides lightning-fast
                transactions with minimal fees. Originally developed by Telegram, TON has gained significant adoption
                and offers an excellent balance of speed, cost, and security. It's particularly popular among users who
                prioritize quick confirmations and low-cost transactions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                All deposits are processed in USDT (Tether), a stablecoin pegged to the US Dollar. This means your card
                balance remains stable and unaffected by cryptocurrency price volatility. When you deposit USDT, the
                value is converted 1:1 to your card balance, giving you predictable spending power without worrying
                about market fluctuations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Card Showcase Section */}
      <ThreeDCardShowcase />

      {/* LiveStats Component */}
      <LiveStats />

      {/* Pricing & Fees Section */}
      <section className="container mx-auto px-4 py-24 relative bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-gray-900">Simple, Clear Pricing</h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto text-pretty leading-relaxed">
            No hidden fees. No surprises. Know exactly what you pay for every transaction.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Pricing Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Card Top-up Fee - Featured */}
            <Card className="lg:col-span-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 overflow-hidden relative group hover:shadow-2xl hover:shadow-blue-200 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 md:p-10 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-balance text-gray-900">
                        Card Top-up Fee
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg mb-2 text-pretty max-w-xl">
                        One-time fee when adding funds to your card
                      </p>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          2.5%
                        </span>
                        <span className="text-3xl md:text-4xl font-bold text-gray-700">+ 1 USDT</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Per top-up transaction</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domestic Transaction */}
            <Card className="bg-white border-gray-200 hover:border-green-400 transition-all duration-300 group hover:shadow-xl hover:shadow-green-100 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/30 group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="w-7 h-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold mb-2 text-gray-900">Domestic Transaction</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Fee for purchases within your country
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl md:text-6xl font-bold text-green-600">$0.35</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">Per transaction</p>
              </CardContent>
            </Card>

            {/* International Transaction */}
            <Card className="bg-white border-gray-200 hover:border-blue-400 transition-all duration-300 group hover:shadow-xl hover:shadow-blue-100 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
                  International Transaction
                </CardTitle>
                <CardDescription className="text-base text-gray-600">Fee for cross-border purchases</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-blue-600">2%</span>
                  <span className="text-2xl md:text-3xl font-bold text-gray-700">+ $0.30</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">Per transaction</p>
              </CardContent>
            </Card>

            {/* Transaction Limits */}
            <Card className="bg-white border-gray-200 hover:border-orange-400 transition-all duration-300 group hover:shadow-xl hover:shadow-orange-100 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/30 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold mb-2 text-gray-900">Transaction Limits</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Maximum spending limits for your security
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1">$200,000</div>
                    <p className="text-sm text-gray-600 font-medium">Per transaction limit</p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1">$500,000</div>
                    <p className="text-sm text-gray-600 font-medium">Daily spending limit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-gray-700">
                All transactions are secured with industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section with Images */}
      <section className="container mx-auto px-4 py-20 relative bg-white/80 backdrop-blur-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Use Your Cards Anywhere</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Shop online, pay in stores, or subscribe to services - your dbank card works everywhere
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Online Shopping */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src="/person-shopping-online-on-laptop-with-credit-card-.jpg"
                alt="Online Shopping"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-blue-600/90 backdrop-blur rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">Online Shopping</h3>
                <p className="text-white/80 text-sm">Shop from thousands of online stores worldwide</p>
              </div>
            </div>
          </div>

          {/* In-Store Payments */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
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
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
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
      <section className="container mx-auto px-4 py-20 relative bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Choose dbank?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience the future of digital banking with instant cards and complete privacy
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Privacy First */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all">
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
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img
                src="/person-holding-smartphone-with-credit-card-creatio.jpg"
                alt="Instant Card Creation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600/90 backdrop-blur rounded-xl flex items-center justify-center">
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
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
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
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
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
      <section id="features" className="container mx-auto px-4 py-20 relative bg-white/80 backdrop-blur-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Everything You Need</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Powerful features to manage your digital cards with complete control and security
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-900">
                Instant Card Creation
              </CardTitle>
              <CardDescription className="text-gray-600">
                Create virtual prepaid cards in seconds. No KYC required - just email and phone number
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-900">
                Flexible Top-ups
              </CardTitle>
              <CardDescription className="text-gray-600">
                Add funds using multiple currencies including USDT, BTC, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-100 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-green-600 transition-colors text-gray-900">
                Privacy & Security
              </CardTitle>
              <CardDescription className="text-gray-600">
                Non-KYC cards with instant freeze/unfreeze controls for complete security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <History className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-orange-600 transition-colors text-gray-900">
                Transaction History
              </CardTitle>
              <CardDescription className="text-gray-600">
                Track all transactions with detailed history and filtering options
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-100 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-yellow-600 transition-colors text-gray-900">
                Real-time Updates
              </CardTitle>
              <CardDescription className="text-gray-600">
                Get instant notifications for all card activities and balance changes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-purple-600 transition-colors text-gray-900">
                Multi-card Management
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage multiple cards from a single dashboard with ease
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section
        id="tokenomics"
        className="container mx-auto px-4 py-24 relative bg-gradient-to-b from-white via-blue-50/40 to-indigo-50/30"
      >
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6">
            <Coins className="w-4 h-4" />
            <span>DBANK Token Economics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tokenomics
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sustainable token distribution designed for long-term growth
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Key Metrics - Simplified */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Total Supply */}
            <Card className="bg-white border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-blue-500" />
                  Total Supply
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-blue-600">10M</div>
                <p className="text-xs text-gray-500 mt-1">Fixed maximum supply</p>
              </CardContent>
            </Card>

            {/* Tax */}
            <Card className="bg-white border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  Buy/Sell Tax
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-purple-600">5/5%</div>
                <p className="text-xs text-gray-500 mt-1">Transaction tax structure</p>
              </CardContent>
            </Card>
          </div>

          {/* Token Utility - Simplified */}
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Token Utility</CardTitle>
              <CardDescription className="text-blue-100">Real-world use cases for DBANK token</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Card Creation</h3>
                    <p className="text-sm text-blue-100">Hold tokens to create virtual prepaid cards</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Governance Rights</h3>
                    <p className="text-sm text-blue-100">Vote on platform decisions and feature updates</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Premium Features</h3>
                    <p className="text-sm text-blue-100">Access exclusive features and lower transaction fees</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative bg-gradient-to-b from-white via-blue-50/40 to-indigo-50/30">
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl" />
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Ready to Get Started?</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
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
      <footer className="border-t border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/dbank-logo.svg" alt="dbank" className="h-6 w-auto" />
            </Link>
            <p className="text-sm text-gray-600">© 2025 dbank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
