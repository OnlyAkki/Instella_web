components / footer.tsx
;("use client")
import { useTranslation } from "@/contexts/translation-context"

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">{/* Content of the footer */}</footer>
  )
}

export default Footer

app / backups / page.tsx
import { getGitHubRepoContents } from "@/lib/github"
import BackupsClient from "./backups-client"
import Footer from "@/components/footer"

const BackupsPage = async () => {
  const backupFolders = await getGitHubRepoContents("OnlyAkki", "Instella_Backup")
  const validBackups = backupFolders.filter((item) => item.type === "dir" && item.name !== ".github")

  return (
    <div className="flex flex-col min-h-screen">
      <BackupsClient backups={validBackups} />
      <Footer />
    </div>
  )
}

export default BackupsPage
export const dynamic = "force-dynamic"

app / downloads / page.tsx
import { getGitHubReleases } from "@/lib/github"
import DownloadsClient from "./downloads-client"
import Footer from "@/components/footer"

const DownloadsPage = async ({ searchParams }) => {
  const releases = await getGitHubReleases("OnlyAbhii", "instella_app")

  return (
    <div className="flex flex-col min-h-screen">
      <DownloadsClient releases={releases} searchParams={searchParams} />
      <Footer />
    </div>
  )
}

export default DownloadsPage
export const dynamic = "force-dynamic"
