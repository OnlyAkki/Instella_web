"use client"
import { getGitHubRepoContents } from "@/lib/github"
import Footer from "@/components/footer"
import BackupsClient from "./backups-client"

export default async function BackupsPage() {
  const backupFolders = await getGitHubRepoContents("OnlyAkki", "Instella_Backup")
  const validBackups = backupFolders.filter((item) => item.type === "dir" && item.name !== ".github") // Exclude .github folder

  return (
    <div className="flex flex-col min-h-screen">
      <BackupsClient backups={validBackups} />
      <Footer />
    </div>
  )
}
