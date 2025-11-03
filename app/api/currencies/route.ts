export async function GET() {
  try {
    const response = await fetch("https://app.zeroid.cc/api/b2b/currencies", {
      headers: {
        "X-API-Key": "b2b_JIL2vsbGBQJoiQoW-4UxjmZ3ktCHP5rDh44aOZBnIrI",
      },
    })

    const text = await response.text()
    console.log("[v0] Currencies API response status:", response.status)

    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
      console.error("[v0] Currencies API returned HTML error page")
      return Response.json(
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
      console.error("[v0] Failed to parse currencies response:", text.substring(0, 200))
      return Response.json({ error: "Invalid response from ZeroID API" }, { status: 500 })
    }

    console.log("[v0] Currencies API response:", data)

    if (!response.ok) {
      return Response.json(data, { status: response.status })
    }

    return Response.json(data)
  } catch (error) {
    console.error("[v0] Error fetching currencies:", error)
    return Response.json({ error: "Failed to fetch currencies" }, { status: 500 })
  }
}
