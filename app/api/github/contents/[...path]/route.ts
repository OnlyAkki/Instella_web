import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  const [owner, repo, ...restPath] = params.path
  const contentPath = restPath.join("/")

  if (!owner || !repo) {
    return new NextResponse(JSON.stringify({ error: "Owner and repository are required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const isRaw = request.nextUrl.searchParams.get("raw") === "true"
  const acceptHeader = isRaw ? "application/vnd.github.v3.raw" : "application/vnd.github.v3+json"

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${contentPath}`, {
      headers: {
        Accept: acceptHeader,
      },
      // Cache for 1 hour to reduce GitHub API calls
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`Failed to fetch contents from GitHub API: ${res.status} ${res.statusText}`)
      return new NextResponse(
        JSON.stringify({ error: `Failed to fetch contents for ${owner}/${repo}/${contentPath}` }),
        {
          status: res.status,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (isRaw) {
      const textContent = await res.text()
      return new NextResponse(textContent, {
        status: 200,
        headers: {
          "Content-Type": res.headers.get("Content-Type") || "text/plain",
        },
      })
    } else {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("Error in GitHub contents API route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
