components / footer.tsx
;("use client")

import { useTranslation } from "@/contexts/translation-context"

export default function FooterComponent() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      {/* … existing footer content … */}
      <p className="text-sm">{t("madeWith")}</p>
    </footer>
  )
}

app / backups / page.tsx
export const dynamic = "force-dynamic"
import { getGitHubRepoContents } from "@/lib/github"
import BackupsClient from "./backups-client"
import Footer from "@/components/footer"

export default async function BackupsPage() {
  const folders = await getGitHubRepoContents("OnlyAkki", "Instella_Backup")
  const backups = folders.filter((f) => f.type === "dir" && f.name !== ".github")

  return (
    <div className="flex flex-col min-h-screen">
      <BackupsClient backups={backups} />
      <Footer />
    </div>
  )
}

app / downloads / page.tsx
import { getGitHubReleases } from "@/lib/github"
import DownloadsClient from "./downloads-client"
import Footer from "@/components/footer"

interface DownloadsPageProps {
  searchParams: { arch?: string; version?: string }
}

export default async function DownloadsPage({ searchParams }: DownloadsPageProps) {
  const releases = await getGitHubReleases("OnlyAbhii", "instella_app")

  return (
    <div className="flex flex-col min-h-screen">
      <DownloadsClient releases={releases} searchParams={searchParams} />
      <Footer />
    </div>
  )
}
