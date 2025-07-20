/**
 * Shared flag types
 * -------------------------------------------------------------------------- */
export interface FlagOption {
  is_enabled: boolean
  delete_media: boolean
  edit_media: boolean
  favorite_media: boolean
  is_redesigned_preview_enabled: boolean
}

export interface Flag {
  id: string
  title: string
  description: string
  source: string
  tags: string[]
  author: string
  date_added: string
  date_removed: string | null
  options: FlagOption
}

export interface FlagManifest {
  flags: Flag[]
}

export interface FlagCategory {
  name: string
  path: string
  flags: Flag[]
}

/**
 * --------------------------------------------------------------------------
 *  ⚡  MAIN PUBLIC API  ⚡
 * -------------------------------------------------------------------------- */
export async function getFlagCategories(): Promise<FlagCategory[]> {
  try {
    const tree = await fetchRepoTree()
    return tree.length ? buildCategoriesFromTree(tree) : getMockCategories()
  } catch (err) {
    console.error("getFlagCategories: Falling back to mock data –", err)
    return getMockCategories()
  }
}

/* ------------------------------------------------------------------------- */
/* ↓↓↓  Internal helpers  ↓↓↓                                                */
/* ------------------------------------------------------------------------- */

type GitTreeItem = { path: string; type: "tree" | "blob" }

/**
 * Fetch the full repository tree with ONE request.
 */
async function fetchRepoTree(): Promise<GitTreeItem[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const url = "https://api.github.com/repos/OnlyAkki/instella_flags/git/trees/main?recursive=1"
  const res = await fetch(url, { headers, next: { revalidate: 0 } })

  if (!res.ok) {
    throw new Error(`GitHub tree fetch failed: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as { tree: GitTreeItem[] }
  return data.tree
}

/**
 * Convert the tree into our domain model.
 */
async function buildCategoriesFromTree(tree: GitTreeItem[]): Promise<FlagCategory[]> {
  const categoryMap = new Map<string, FlagCategory>()

  // 1️⃣  Find every ".../manifest.json"
  const manifestBlobs = tree.filter((i) => i.type === "blob" && i.path.endsWith("manifest.json"))

  // 2️⃣  Download each manifest (raw.githubusercontent.com is NOT rate-limited)
  await Promise.all(
    manifestBlobs.map(async (blob) => {
      const [category, flagFolder] = blob.path.split("/")

      try {
        const manifest = await fetchManifest(category, flagFolder)
        if (!manifest) return

        let cat = categoryMap.get(category)
        if (!cat) {
          cat = { name: category, path: category, flags: [] }
          categoryMap.set(category, cat)
        }
        cat.flags.push(...manifest.flags)
      } catch (err) {
        console.warn(`Failed to parse manifest ${blob.path}:`, err)
      }
    }),
  )

  return [...categoryMap.values()]
}

/**
 * Grab and parse one manifest.json via the fast raw host.
 */
async function fetchManifest(category: string, flagFolder: string): Promise<FlagManifest | null> {
  const rawURL = `https://raw.githubusercontent.com/OnlyAkki/instella_flags/main/${category}/${flagFolder}/manifest.json`
  const res = await fetch(rawURL, { next: { revalidate: 0 } })
  if (!res.ok) return null
  return (await res.json()) as FlagManifest
}

/**
 * Public helper for fetching a flag image.
 * We no longer burn an API call – we go straight to the raw URL and try common
 * image extensions.
 */
export async function getFlagImage(category: string, flagFolder: string): Promise<string | null> {
  const exts = ["jpg", "jpeg", "png", "gif", "webp"]
  for (const ext of exts) {
    const url = `https://raw.githubusercontent.com/OnlyAkki/instella_flags/main/${category}/${flagFolder}/image.${ext}`
    const res = await fetch(url, { method: "HEAD", next: { revalidate: 0 } })
    if (res.ok) return url
  }
  return null
}

/**
 * Basic client-side search helper.
 */
export function searchFlags(flags: Flag[], query: string): Flag[] {
  if (!query.trim()) return flags
  const q = query.toLowerCase()
  return flags.filter(
    (f) =>
      f.title.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.tags.some((t) => t.toLowerCase().includes(q)) ||
      f.author.toLowerCase().includes(q),
  )
}

/* ------------------------------------------------------------------------- */
/* 🧪  Mock data fallback                                                     */
/* ------------------------------------------------------------------------- */

function getMockCategories(): FlagCategory[] {
  return [
    {
      name: "direct",
      path: "direct",
      flags: [
        {
          id: "72063",
          title: "Republic of India",
          description:
            "The national flag of India, also known as the Tiranga. It consists of three horizontal stripes: saffron, white (with the Ashoka Chakra), and green.",
          source: "https://instafel.app/library/flag/view?id=72063",
          tags: ["flag", "India", "national flag", "Tiranga", "Asia"],
          author: "instafel_user",
          date_added: "2025-07-19",
          date_removed: null,
          options: {
            is_enabled: true,
            delete_media: false,
            edit_media: true,
            favorite_media: false,
            is_redesigned_preview_enabled: true,
          },
        },
      ],
    },
  ]
}
