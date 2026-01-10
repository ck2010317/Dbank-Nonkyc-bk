"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"

interface StatusLog {
  id: string
  message: string
  status: "fetching" | "okay" | "error" | "complete"
  timestamp: Date
}

export function TerminalStatus() {
  const [logs, setLogs] = useState<StatusLog[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Simulate terminal status messages
    const addLog = (message: string, status: StatusLog["status"]) => {
      const newLog: StatusLog = {
        id: Date.now().toString(),
        message,
        status,
        timestamp: new Date(),
      }
      setLogs((prev) => {
        const updated = [...prev, newLog]
        // Keep only last 8 logs
        return updated.slice(-8)
      })
    }

    // Initial startup sequence
    addLog("$ dbank-client init", "okay")
    addLog("Initializing dashboard...", "fetching")

    const timer1 = setTimeout(() => {
      addLog("Connected to API server", "okay")
      addLog("Fetching user profile...", "fetching")
    }, 800)

    const timer2 = setTimeout(() => {
      addLog("User profile loaded", "okay")
      addLog("Syncing card database...", "fetching")
    }, 1600)

    const timer3 = setTimeout(() => {
      addLog("Card sync complete", "complete")
      addLog("System ready", "okay")
    }, 2400)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-green-500/30 mb-6 md:mb-8 overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-green-500/20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
          </div>
          <span className="text-xs md:text-sm font-mono text-green-400 select-none">dbank-terminal</span>
          <span className="text-xs md:text-sm font-mono text-green-400/50 ml-auto select-none">
            {mounted && new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Terminal Content */}
        <div className="space-y-2 font-mono text-xs md:text-sm min-h-[150px] md:min-h-[180px]">
          {logs.length === 0 ? (
            <div className="text-green-400/50 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Initializing system...</span>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <span className="text-green-500/60 flex-shrink-0 select-none">
                  {log.status === "fetching" && <Loader2 className="w-4 h-4 animate-spin" />}
                  {log.status === "okay" && <span className="text-green-400">▸</span>}
                  {log.status === "complete" && <Check className="w-4 h-4 text-green-400" />}
                  {log.status === "error" && <span className="text-red-400">✕</span>}
                </span>
                <div className="flex-1 min-w-0">
                  <span
                    className={`break-words ${
                      log.status === "error"
                        ? "text-red-400"
                        : log.status === "complete"
                          ? "text-green-300"
                          : log.status === "fetching"
                            ? "text-yellow-400"
                            : "text-green-400"
                    }`}
                  >
                    {log.message}
                  </span>
                  {log.status === "okay" && <span className="text-green-600 animate-pulse ml-2">→</span>}
                </div>
                <span className="text-green-500/30 text-xs flex-shrink-0 select-none">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Terminal Footer */}
        <div className="mt-4 pt-4 border-t border-green-500/20">
          <div className="flex items-center gap-2 text-green-400 text-xs md:text-sm font-mono">
            <span>$</span>
            <span className="text-green-400/70">status: {logs[logs.length - 1]?.status || "ready"}</span>
            <span className="text-green-500 animate-pulse ml-1">█</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
