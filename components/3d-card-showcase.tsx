"use client"

import { useState } from "react"

export function ThreeDCardShowcase() {
  const [isExpanded, setIsExpanded] = useState(false)

  const cards = [
    {
      gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      brand: "VISA",
      balance: "$2,500.00",
      cardNumber: "•••• •••• •••• 6789",
      expiry: "12/27",
      cvv: "•••",
    },
    {
      gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
      brand: "MASTERCARD",
      balance: "$5,000.00",
      cardNumber: "•••• •••• •••• 1098",
      expiry: "09/28",
      cvv: "•••",
    },
    {
      gradient: "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
      brand: "VISA",
      balance: "$1,200.00",
      cardNumber: "•••• •••• •••• 0005",
      expiry: "03/29",
      cvv: "•••",
    },
  ]

  return (
    <div className="w-full py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Cards, Your Control</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create beautiful, functional virtual cards instantly with dbank
          </p>
        </div>

        <div className="flex justify-center items-center min-h-[220px] md:min-h-[320px] overflow-hidden px-4 md:px-8">
          <div
            className="relative w-full max-w-[240px] md:max-w-[360px] h-[180px] md:h-[240px] cursor-pointer"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="absolute top-0 left-1/2 w-full aspect-[1.586/1] rounded-2xl p-4 md:p-6 shadow-2xl transition-all duration-500 ease-out"
                style={{
                  background: card.gradient,
                  transform: isExpanded
                    ? window.innerWidth < 768
                      ? `translateX(calc(-50% + ${(index - 1) * 35}%)) translateY(${index * 8}px) rotateY(${
                          (index - 1) * 5
                        }deg) scale(0.95)`
                      : `translateX(calc(-50% + ${(index - 1) * 45}%)) translateY(${index * 10}px) rotateY(${
                          (index - 1) * 8
                        }deg) scale(0.98)`
                    : `translateX(-50%) translateY(${index * 4}px) scale(1)`,
                  zIndex: isExpanded ? 10 + index : 10 - index,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Card background effects */}
                <div className="absolute inset-0 opacity-10 rounded-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between text-white">
                  {/* Top section - Brand and Balance */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] md:text-xs text-white/60 mb-1 uppercase tracking-wider">Balance</p>
                      <p className="text-lg md:text-2xl font-bold">{card.balance}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm md:text-lg font-bold tracking-wider">{card.brand}</p>
                    </div>
                  </div>

                  {/* Card number */}
                  <div className="space-y-2">
                    <p className="text-lg md:text-2xl font-mono tracking-[0.3em]">{card.cardNumber}</p>
                  </div>

                  {/* Bottom info */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] md:text-[10px] text-white/60 mb-1 uppercase tracking-wider">
                        Card Holder
                      </p>
                      <p className="text-xs md:text-sm font-semibold uppercase tracking-wide">dbank</p>
                    </div>
                    <div className="flex gap-3 md:gap-6">
                      <div className="text-right">
                        <p className="text-[9px] md:text-[10px] text-white/60 mb-1 uppercase tracking-wider">Expires</p>
                        <p className="text-xs md:text-sm font-mono font-bold">{card.expiry}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] md:text-[10px] text-white/60 mb-1 uppercase tracking-wider">CVV</p>
                        <p className="text-xs md:text-sm font-mono font-bold">{card.cvv}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
