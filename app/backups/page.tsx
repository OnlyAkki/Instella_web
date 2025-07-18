import { getGitHubRepoContents } from "@/lib/github"
import Footer from "@/components/footer"
import BackupsClient from "./backups-client"

export default async function BackupsPage() {
  console.log("BackupsPage: Fetching GitHub repo contents for backups...")
  const backupFolders = await getGitHubRepoContents("OnlyAkki", "Instella_Backup")
  console.log("BackupsPage: Raw backupFolders fetched:", backupFolders)

  const validBackups = backupFolders.filter((item) => item.type === "dir" && item.name !== ".github")
  console.log("BackupsPage: Filtered validBackups:", validBackups)

  return (
    <div className="flex flex-col min-h-screen">
      <BackupsClient backups={validBackups} />
      <Footer />
    </div>
  )
}
