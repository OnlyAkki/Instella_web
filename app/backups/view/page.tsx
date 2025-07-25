import { getGitHubRepoContents, getGitHubFileContent } from "@/lib/github"
import Footer from "@/components/footer"
import BackupViewClient from "./backup-view-client"

interface BackupViewPageProps {
  searchParams: {
    id?: string
    version?: string
  }
}

interface ManifestData {
  manifest_version?: number
  manifest?: {
    version_name: string
    backup_version: number
    author: string
    changelog?: string
    name: string
    last_updated: string
    description: string
    optional?: {
      show_author_socials?: boolean
    }
    optional_values?: {
      author_socials?: any
    }
  }
}

export default async function BackupViewPage({ searchParams }: BackupViewPageProps) {
  const backupId = searchParams.id
  console.log("BackupViewPage: Received backupId:", backupId)

  if (!backupId) {
    console.log("BackupViewPage: Backup ID is missing.")
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Backup ID Missing</h1>
            <p className="text-muted-foreground">Please provide a backup ID in the URL.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  let manifestData: ManifestData | null = null
  let mcOverridesDownloadUrl: string | null = null
  let error: string | null = null

  try {
    console.log(`BackupViewPage: Fetching contents for backup ID: ${backupId}`)
    const folderContents = await getGitHubRepoContents("OnlyAkki", "Instella_Backup", backupId)
    console.log("BackupViewPage: folderContents:", folderContents)

    const manifestFile = folderContents.find((item) => item.name === "manifest.json" && item.type === "file")
    const mcOverridesFile = folderContents.find((item) => item.name === "mc_overrides.json" && item.type === "file")

    if (manifestFile && manifestFile.download_url) {
      console.log("BackupViewPage: Found manifest.json, fetching content...")
      const manifestContent = await getGitHubFileContent(manifestFile.download_url)
      if (manifestContent) {
        manifestData = JSON.parse(manifestContent) as ManifestData
        console.log("BackupViewPage: Parsed manifestData:", manifestData)
      } else {
        console.warn("BackupViewPage: Failed to get content for manifest.json")
      }
    } else {
      console.warn("BackupViewPage: manifest.json not found or download_url missing.")
    }

    if (mcOverridesFile && mcOverridesFile.download_url) {
      mcOverridesDownloadUrl = mcOverridesFile.download_url
      console.log("BackupViewPage: mcOverridesDownloadUrl found:", mcOverridesDownloadUrl)
    } else {
      console.warn("BackupViewPage: mc_overrides.json not found or download_url missing.")
    }
  } catch (err) {
    console.error("BackupViewPage: Error fetching backup details:", err)
    error = "Failed to load backup details"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <BackupViewClient
        backupId={backupId}
        manifestData={manifestData}
        mcOverridesDownloadUrl={mcOverridesDownloadUrl}
        error={error}
      />
      <Footer />
    </div>
  )
}
