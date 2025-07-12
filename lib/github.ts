interface GitHubReleaseAsset {
  browser_download_url: string
  name: string
  size: number
  content_type: string
}

interface GitHubRelease {
  tag_name: string
  name: string | null
  body: string | null
  assets: GitHubReleaseAsset[]
  published_at: string
}

interface GitHubContent {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: "file" | "dir"
  _links: {
    git: string
    self: string
    html: string
  }
}

export async function getGitHubReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
  try {
    // Call the internal API route
    const res = await fetch(`/api/github/releases`)

    if (!res.ok) {
      console.error(`Failed to fetch releases from internal API:`, res.status, res.statusText)
      return []
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching GitHub releases:", error)
    return []
  }
}

export async function getGitHubRepoContents(owner: string, repo: string, path = ""): Promise<GitHubContent[]> {
  try {
    // Call the internal API route
    const res = await fetch(`/api/github/contents/${owner}/${repo}/${path}`)

    if (!res.ok) {
      console.error(`Failed to fetch contents from internal API:`, res.status, res.statusText)
      return []
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching GitHub repo contents:", error)
    return []
  }
}

export async function getGitHubFileContent(url: string): Promise<string | null> {
  try {
    // Example raw.githubusercontent.com URL:
    // https://raw.githubusercontent.com/OnlyAkki/Instella_Backup/main/backup-name/manifest.json
    const urlObj = new URL(url)
    if (urlObj.hostname !== "raw.githubusercontent.com") {
      console.error("URL is not from raw.githubusercontent.com, skipping proxy:", url)
      // If it's not a raw content URL, we might not need to proxy it through our /api/github/contents
      // For now, we'll return null, but in a real app, you might fetch it directly if it's a different type of URL.
      return null
    }

    const pathSegments = urlObj.pathname.split("/").filter(Boolean) // Remove empty strings from split
    if (pathSegments.length < 3) {
      // Expects at least owner, repo, and branch/commit
      console.error("Invalid raw.githubusercontent.com URL path:", url)
      return null
    }

    const owner = pathSegments[0]
    const repo = pathSegments[1]
    // The rest of the path, including the branch/commit and the file path within the repo
    const contentPath = pathSegments.slice(2).join("/")

    // Call the internal API route with the 'raw' query parameter
    const res = await fetch(`/api/github/contents/${owner}/${repo}/${contentPath}?raw=true`)

    if (!res.ok) {
      console.error(`Failed to fetch file content from internal API: ${res.status} ${res.statusText}`)
      return null
    }
    return res.text()
  } catch (error) {
    console.error("Error fetching GitHub file content:", error)
    return null
  }
}
