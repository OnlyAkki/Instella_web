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
  flag_name?: string // Flag name from manifest.json
}

export interface FlagManifest {
  flags: Flag[]
}

export interface FlagCategory {
  name: string
  path: string
  flags: Flag[]
  icon?: string // Add icon for categories
}

// Category icons mapping based on the screenshot
export const CATEGORY_ICONS: Record<string, string> = {
  all: "Archive",
  direct: "Send",
  reels: "Play",
  stories: "PlusCircle",
  feed: "Archive",
  interface: "Layout",
  notes: "FileText",
  quality: "Image",
  profile: "User",
  comments: "MessageCircle",
  camera: "Camera",
  "meta ai": "Briefcase",
  default: "Flag",
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
          cat = {
            name: category,
            path: category,
            flags: [],
            icon: CATEGORY_ICONS[category.toLowerCase()] || CATEGORY_ICONS.default,
          }
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
 * Enhanced search helper that includes flag ID search.
 */
export function searchFlags(flags: Flag[], query: string): Flag[] {
  if (!query.trim()) return flags
  const q = query.toLowerCase().trim()

  return flags.filter((f) => {
    // Search in title
    if (f.title.toLowerCase().includes(q)) return true

    // Search in description
    if (f.description.toLowerCase().includes(q)) return true

    // Search in tags
    if (f.tags.some((t) => t.toLowerCase().includes(q))) return true

    // Search in author
    if (f.author.toLowerCase().includes(q)) return true

    // Search in flag ID (exact match or partial)
    if (f.id.toLowerCase().includes(q)) return true

    // Search in flag name from manifest
    if (f.flag_name && f.flag_name.toLowerCase().includes(q)) return true

    return false
  })
}

/* ------------------------------------------------------------------------- */
/* 🧪  Mock data fallback                                                     */
/* ------------------------------------------------------------------------- */

function getMockCategories(): FlagCategory[] {
  return [
    {
      name: "direct",
      path: "direct",
      icon: CATEGORY_ICONS.direct,
      flags: [
        {
          id: "72063",
          title: "Direct Message Enhancement",
          description:
            "Enhanced direct messaging features with improved UI and functionality for better user experience.",
          source: "https://instafel.app/library/flag/view?id=72063",
          tags: ["direct", "messaging", "ui", "enhancement"],
          author: "instafel_user",
          date_added: "2025-07-19",
          date_removed: null,
          flag_name: "ig_android_direct_inbox_redesign",
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
    {
      name: "stories",
      path: "stories",
      icon: CATEGORY_ICONS.stories,
      flags: [
        {
          id: "51234",
          title: "Stories Camera Enhancement",
          description: "Improved camera functionality for Instagram Stories with new filters and effects.",
          source: "https://instafel.app/library/flag/view?id=51234",
          tags: ["stories", "camera", "filters", "effects"],
          author: "stories_dev",
          date_added: "2025-07-20",
          date_removed: null,
          flag_name: "ig_android_stories_camera_v2",
          options: {
            is_enabled: true,
            delete_media: false,
            edit_media: true,
            favorite_media: true,
            is_redesigned_preview_enabled: true,
          },
        },
      ],
    },
    {
      name: "reels",
      path: "reels",
      icon: CATEGORY_ICONS.reels,
      flags: [
        {
          id: "98765",
          title: "Reels Player Optimization",
          description: "Optimized video player for Instagram Reels with better performance and quality.",
          source: "https://instafel.app/library/flag/view?id=98765",
          tags: ["reels", "video", "player", "optimization"],
          author: "reels_team",
          date_added: "2025-07-21",
          date_removed: null,
          flag_name: "ig_android_reels_player_v3",
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
