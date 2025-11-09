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
    <div className="relative w-full max-w-[400px] aspect-[1.7/1] rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-3 md:p-6 shadow-2xl overflow-hidden">
      {/* Card background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="absolute top-10 md:top-16 left-3 md:left-6 w-10 md:w-12 h-8 md:h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md opacity-80 shadow-lg" />

      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between text-white z-10">
        {/* Top section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-white/80" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Balance
              </p>
              <p className="text-sm md:text-lg font-bold text-white" style={{ color: "#ffffff" }}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
          {status === "frozen" && (
            <div
              className="px-2 py-1 md:px-3 bg-destructive/20 backdrop-blur-sm rounded-full text-xs font-medium text-white"
              style={{ color: "#ffffff" }}
            >
              Frozen
            </div>
          )}
        </div>

        {/* Middle section - Card number */}
        <div className="space-y-1 mt-2 md:mt-8">
          <div className="flex items-center gap-2">
            <p className="text-sm md:text-xl font-mono tracking-wider text-white" style={{ color: "#ffffff" }}>
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
        <div className="flex items-end justify-between gap-2 mt-2">
          <div className="flex-shrink min-w-0">
            <p className="text-[9px] md:text-xs text-white/90 mb-0.5" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
              Card Holder
            </p>
            <p
              className="text-[11px] md:text-sm font-medium uppercase text-white truncate"
              style={{ color: "#ffffff" }}
            >
              {holderName}
            </p>
          </div>
          <div className="flex gap-4 md:gap-6 flex-shrink-0">
            <div className="text-right">
              <p className="text-[9px] md:text-xs text-white/90 mb-0.5" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Expires
              </p>
              <p className="text-[11px] md:text-sm font-mono text-white font-semibold" style={{ color: "#ffffff" }}>
                {expiryDate}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] md:text-xs text-white/90 mb-0.5" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                CVV
              </p>
              <p className="text-[11px] md:text-sm font-mono text-white font-semibold" style={{ color: "#ffffff" }}>
                {cvv}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
