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
    // REMOVED: await new Promise((resolve) => setTimeout(resolve, 1000)) // This line was removed

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`Failed to fetch releases from ${owner}/${repo}:`, res.status, res.statusText)
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
    // REMOVED: await new Promise((resolve) => setTimeout(resolve, 1000)) // This line was removed

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`Failed to fetch contents from ${owner}/${repo}/${path}:`, res.status, res.statusText)
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
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`Failed to fetch file content from ${url}:`, res.status, res.statusText)
      return null
    }
    return res.text()
  } catch (error) {
    console.error("Error fetching GitHub file content:", error)
    return null
  }
}
