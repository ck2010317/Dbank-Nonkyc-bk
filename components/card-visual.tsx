"use client"

import { CreditCard, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CardVisualProps {
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  holderName?: string
  balance?: number
  status?: "active" | "frozen"
}

export function CardVisual({
  cardNumber = "•••• •••• •••• ••••",
  expiryDate = "••/••",
  cvv = "•••",
  holderName = "Card Holder",
  balance = 0,
  status = "active",
}: CardVisualProps) {
  const [copied, setCopied] = useState(false)

  const copyCardNumber = () => {
    if (cardNumber && cardNumber !== "•••• •••• •••• ••••") {
      navigator.clipboard.writeText(cardNumber.replace(/\s/g, ""))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative w-full max-w-[400px] aspect-[1.586/1] min-h-0 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 shadow-2xl overflow-hidden">
      {/* Card background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="absolute top-16 left-6 w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md opacity-80 shadow-lg" />

      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between text-white z-10">
        {/* Top section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/80" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Balance
              </p>
              <p className="text-lg font-bold text-white" style={{ color: "#ffffff" }}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
          {status === "frozen" && (
            <div
              className="px-3 py-1 bg-destructive/20 backdrop-blur-sm rounded-full text-xs font-medium text-white"
              style={{ color: "#ffffff" }}
            >
              Frozen
            </div>
          )}
        </div>

        {/* Middle section - Card number */}
        <div className="space-y-1 mt-8">
          <div className="flex items-center gap-2">
            <p className="text-xl font-mono tracking-wider text-white" style={{ color: "#ffffff" }}>
              {cardNumber}
            </p>
            {cardNumber !== "•••• •••• •••• ••••" && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={copyCardNumber}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-white/80 mb-1" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Card Holder
            </p>
            <p className="text-sm font-medium uppercase text-white" style={{ color: "#ffffff" }}>
              {holderName}
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-white/80 mb-1" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Expires
              </p>
              <p className="text-sm font-mono text-white" style={{ color: "#ffffff" }}>
                {expiryDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/80 mb-1" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                CVV
              </p>
              <p className="text-sm font-mono text-white" style={{ color: "#ffffff" }}>
                {cvv}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 opacity-80">
            <rect
              x="10"
              y="25"
              width="80"
              height="50"
              rx="8"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="white"
              strokeWidth="2"
            />
            <rect x="20" y="35" width="15" height="12" rx="2" fill="white" opacity="0.8" />
            <line x1="20" y1="55" x2="50" y2="55" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="20" y1="62" x2="40" y2="62" stroke="white" strokeWidth="2" opacity="0.6" />
            <path d="M 60 40 L 60 60 Q 75 60 75 50 Q 75 40 60 40 Z" fill="white" opacity="0.9" />
          </svg>
        </div>
      </div>
    </div>
  )
}
