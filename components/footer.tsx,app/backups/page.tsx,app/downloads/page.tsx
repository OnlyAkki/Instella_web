components / footer.tsx
;("use client") // 1️⃣  must be first

import { useTranslation } from "@/contexts/translation-context"

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      {/* …existing footer markup… */}
      <p className="text-sm">{t("madeWith")}</p>
    </footer>
  )
}

app / backups / page.tsx
import { getGitHubRepoContents } from "@/lib/github"
import BackupsClient from "./backups-client"
import Footer from "@/components/footer"

export const dynamic = "force-dynamic" // 1️⃣  tell Next.js this page is always dynamic

export default async function BackupsPage() { // 2️⃣  default export restored
  const backupFolders = await getGitHubRepoContents("OnlyAkki", "Instella_Backup")
  const validBackups = backupFolders.filter((item) => item.type === "dir" && item.name !== ".github")

  return (
    <div className="flex flex-col min-h-screen">
      <BackupsClient backups={validBackups} />
      <Footer />
    </div>
  )
}

app / downloads / page.tsx
import { getGitHubReleases } from "@/lib/github"
import DownloadsClient from "./downloads-client"
import Footer from "@/components/footer"

interface DownloadsPageProps {
  searchParams: { version?: string; arch?: string }
}

export const dynamic = "force-dynamic" // 1️⃣  dynamic page flag

export default async function DownloadsPage({ searchParams }: DownloadsPageProps) { // 2️⃣ default export intact
  const releases = await getGitHubReleases("OnlyAbhii", "instella_app")

  return (
    <div className="flex flex-col min-h-screen">
      <DownloadsClient releases={releases} searchParams={searchParams} />
      <Footer />
    </div>
  )
}
