"use client"

import { useEffect, useRef } from "react"
import { CreditCard } from "lucide-react"

export function ThreeDCardShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const cards = container.querySelectorAll(".card-3d")
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect()
        const cardX = e.clientX - cardRect.left
        const cardY = e.clientY - cardRect.top
        const centerX = cardRect.width / 2
        const centerY = cardRect.height / 2

        const rotateX = (cardY - centerY) / 10
        const rotateY = (centerX - cardX) / 10
        ;(card as HTMLElement).style.transform =
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
      })
    }

    const handleMouseLeave = () => {
      const cards = container.querySelectorAll(".card-3d")
      cards.forEach((card) => {
        ;(card as HTMLElement).style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
      })
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Digital Cards</h2>
          <p className="text-muted-foreground text-lg">Premium virtual cards with full control</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {/* Card 1 - Blue Gradient */}
          <div
            className="card-3d w-[320px] h-[200px] rounded-2xl transition-all duration-300 ease-out cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              transformStyle: "preserve-3d",
              boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
            }}
          >
            <div className="relative w-full h-full p-6 flex flex-col justify-between">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Balance</p>
                    <p className="text-lg font-bold text-white">$1,234.56</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg" />
              </div>

              {/* Card Number */}
              <div className="space-y-4">
                <p className="text-white text-xl font-mono tracking-wider">•••• •••• •••• 4716</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Card Holder</p>
                    <p className="text-sm font-medium text-white uppercase">dbank User</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70 mb-1">Expires</p>
                    <p className="text-sm font-mono text-white">12/28</p>
                  </div>
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 opacity-90"
                  >
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
          </div>

          {/* Card 2 - Green Gradient */}
          <div
            className="card-3d w-[320px] h-[200px] rounded-2xl transition-all duration-300 ease-out cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              transformStyle: "preserve-3d",
              boxShadow: "0 20px 60px rgba(17, 153, 142, 0.3)",
            }}
          >
            <div className="relative w-full h-full p-6 flex flex-col justify-between">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Balance</p>
                    <p className="text-lg font-bold text-white">$2,567.89</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg" />
              </div>

              {/* Card Number */}
              <div className="space-y-4">
                <p className="text-white text-xl font-mono tracking-wider">•••• •••• •••• 8923</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Card Holder</p>
                    <p className="text-sm font-medium text-white uppercase">dbank User</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70 mb-1">Expires</p>
                    <p className="text-sm font-mono text-white">11/29</p>
                  </div>
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 opacity-90"
                  >
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
          </div>

          {/* Card 3 - Orange Gradient */}
          <div
            className="card-3d w-[320px] h-[200px] rounded-2xl transition-all duration-300 ease-out cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              transformStyle: "preserve-3d",
              boxShadow: "0 20px 60px rgba(240, 147, 251, 0.3)",
            }}
          >
            <div className="relative w-full h-full p-6 flex flex-col justify-between">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Balance</p>
                    <p className="text-lg font-bold text-white">$3,890.12</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg" />
              </div>

              {/* Card Number */}
              <div className="space-y-4">
                <p className="text-white text-xl font-mono tracking-wider">•••• •••• •••• 5431</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Card Holder</p>
                    <p className="text-sm font-medium text-white uppercase">dbank User</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70 mb-1">Expires</p>
                    <p className="text-sm font-mono text-white">09/27</p>
                  </div>
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 opacity-90"
                  >
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
          </div>
        </div>
      </div>
    </div>
  )
}
