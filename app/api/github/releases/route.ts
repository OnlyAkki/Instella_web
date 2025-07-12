import { NextResponse } from "next/server"

const GITHUB_OWNER = "OnlyAbhii"
const GITHUB_REPO = "instella_app"

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      // Cache for 1 hour to reduce GitHub API calls
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`Failed to fetch releases from GitHub API: ${res.status} ${res.statusText}`)
      return new NextResponse(JSON.stringify({ error: "Failed to fetch releases" }), {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GitHub releases API route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
