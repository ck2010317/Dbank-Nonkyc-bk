"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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
    <div className="relative w-full max-w-[400px] aspect-[1.7/1] rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 md:p-7 shadow-2xl overflow-hidden">
      {/* Card background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Card content */}
      <div className="relative h-full flex flex-col text-white z-10">
        {/* Top section */}
        <div className="flex items-start justify-between mb-5 md:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center p-2">
              <Image src="/dbank-d-logo.svg" alt="dbank" width={48} height={48} className="w-full h-full" />
            </div>
            <div>
              <p className="text-[11px] md:text-xs text-white/80 uppercase tracking-wide">Balance</p>
              <p className="text-base md:text-lg font-bold text-white">${balance.toFixed(2)}</p>
            </div>
          </div>
          {status === "frozen" && (
            <div className="px-2 py-1 md:px-3 bg-destructive/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
              Frozen
            </div>
          )}
        </div>

        {/* Middle section - Card number */}
        <div className="space-y-1 mb-5 md:mb-6">
          <div className="flex items-center gap-2">
            <p className="text-base md:text-xl font-mono tracking-wider text-white">{cardNumber}</p>
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

        <div className="flex items-end justify-between gap-3 mt-auto pt-2">
          <div className="flex-shrink min-w-0 max-w-[45%]">
            <p className="text-[10px] md:text-xs text-white/90 mb-1.5 leading-none">Card Holder</p>
            <p className="text-sm md:text-base font-medium uppercase text-white truncate leading-tight">{holderName}</p>
          </div>
          <div className="flex gap-4 md:gap-6 flex-shrink-0 items-end">
            <div className="text-right">
              <p className="text-[10px] md:text-xs text-white/90 mb-1.5 leading-none whitespace-nowrap">Expires</p>
              <p className="text-sm md:text-base font-mono text-white font-bold leading-tight whitespace-nowrap">
                {expiryDate}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] md:text-xs text-white/90 mb-1.5 leading-none whitespace-nowrap">CVV</p>
              <p className="text-sm md:text-base font-mono text-white font-bold leading-tight whitespace-nowrap">
                {cvv}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
