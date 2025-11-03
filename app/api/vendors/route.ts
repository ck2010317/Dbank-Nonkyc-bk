import { NextResponse } from "next/server"

const API_BASE_URL = "https://app.zeroid.cc/api/b2b"
const API_KEY = process.env.ZEROID_API_KEY || "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI"

export async function GET() {
  try {
    console.log("[v0] Server: Fetching vendors from ZeroID API...")

    const response = await fetch(`${API_BASE_URL}/vendors`, {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Server: Vendors API response status:", response.status)

    const text = await response.text()

    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
      console.error("[v0] Server: Vendors API returned HTML error page")
      return NextResponse.json(
        {
          error: "ZeroID API is temporarily unavailable. Please try again later.",
          status: response.status,
        },
        { status: 503 },
      )
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error("[v0] Server: Failed to parse vendors response:", text.substring(0, 200))
      return NextResponse.json({ error: "Invalid response from ZeroID API" }, { status: 500 })
    }

    if (!response.ok) {
      console.error("[v0] Server: Vendors API error:", data)
      return NextResponse.json({ error: "Failed to fetch vendors", details: data }, { status: response.status })
    }

    console.log("[v0] Server: Vendors data:", data)

    // Return vendors array
    if (Array.isArray(data)) {
      return NextResponse.json(data)
    }
    if (data && Array.isArray(data.vendors)) {
      return NextResponse.json(data.vendors)
    }

    return NextResponse.json([])
  } catch (error) {
    console.error("[v0] Server: Error fetching vendors:", error)
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}
