"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard } from "lucide-react"

interface Card3DProps {
  gradient: string
  balance: string
  cardNumber: string
  expiry: string
  cvv: string
  delay: number
}

function Card3D({ gradient, balance, cardNumber, expiry, cvv, delay }: Card3DProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateXValue = ((y - centerY) / centerY) * -10
    const rotateYValue = ((x - centerX) / centerX) * 10

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      className="w-full max-w-sm perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className="relative w-full aspect-[1.6/1] rounded-2xl p-6 shadow-2xl transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          background: gradient,
        }}
      >
        {/* Card background effects */}
        <div className="absolute inset-0 opacity-20 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between text-white">
          {/* Top section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/80">Balance</p>
                <p className="text-lg font-bold">{balance}</p>
              </div>
            </div>
          </div>

          {/* Card number */}
          <div className="space-y-2">
            <p className="text-xl font-mono tracking-widest">{cardNumber}</p>
          </div>

          {/* Bottom info */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-white/80 mb-1">Card Holder</p>
              <p className="text-sm font-medium uppercase">dbank</p>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-xs text-white/80 mb-1">Expires</p>
                <p className="text-sm font-mono font-bold">{expiry}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/80 mb-1">CVV</p>
                <p className="text-sm font-mono font-bold">{cvv}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ThreeDCardShowcase() {
  const cards = [
    {
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      balance: "$2,500.00",
      cardNumber: "•••• •••• •••• 6789",
      expiry: "12/27",
      cvv: "•••",
      delay: 0,
    },
    {
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      balance: "$5,000.00",
      cardNumber: "•••• •••• •••• 1098",
      expiry: "09/28",
      cvv: "•••",
      delay: 150,
    },
    {
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      balance: "$1,200.00",
      cardNumber: "•••• •••• •••• 0005",
      expiry: "03/29",
      cvv: "•••",
      delay: 300,
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <Card3D key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}
