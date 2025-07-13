"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, User, Tag, FileText, File } from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { downloadFile } from "../download-action"
import { useState } from "react"

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

interface BackupViewClientProps {
  backupId: string
  manifestData: ManifestData | null
  mcOverridesDownloadUrl: string | null
  error: string | null
}

export default function BackupViewClient({
  backupId,
  manifestData,
  mcOverridesDownloadUrl,
  error,
}: BackupViewClientProps) {
  const router = useRouter()
  const manifest = manifestData?.manifest
  const [isDownloading, setIsDownloading] = useState(false)

  // Safely parse the last-updated date
  const lastUpdatedDate = manifest?.last_updated
    ? (() => {
        console.log("Parsing date: Raw string =", manifest.last_updated)
        const parsed = parseISO(manifest.last_updated)
        console.log("Parsing date: parseISO result =", parsed)
        const valid = isValid(parsed)
        console.log("Parsing date: isValid result =", valid)
        return valid ? parsed : null
      })()
    : null

  console.log("BackupViewClient: Rendering with mcOverridesDownloadUrl:", mcOverridesDownloadUrl)

  const handleBackToBackups = () => {
    console.log("BackupViewClient: Navigating back to /backups")
    router.push("/backups")
  }

  const handleDownloadBackup = async () => {
    if (!mcOverridesDownloadUrl) {
      console.error("BackupViewClient: Download URL is missing for mc_overrides.json")
      alert("Download file not available.")
      return
    }

    setIsDownloading(true)

    try {
      console.log("BackupViewClient: Initiating download via Server Action for:", mcOverridesDownloadUrl)
      const response = await downloadFile(mcOverridesDownloadUrl, `${backupId}_mc_overrides.json`)

      if (!response.ok) {
        const errorMessage = await response.text()
        console.error("BackupViewClient: Download failed:", errorMessage)
        alert(`Failed to download file: ${errorMessage}`)
      } else {
        console.log("BackupViewClient: Download initiated successfully by server action.")
      }
    } catch (err: any) {
      console.error("BackupViewClient: Error calling downloadFile Server Action:", err)
      alert(`An unexpected error occurred: ${err.message || "Please try again."}`)
    } finally {
      setIsDownloading(false)
    }
  }

  if (error || !manifest) {
    console.log("BackupViewClient: Displaying error state. Error:", error, "Manifest exists:", !!manifest)
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || `Could not load backup details for "${backupId}"`}</h1>
          <p className="text-muted-foreground mb-6">The backup might not exist or there was an error loading it.</p>
          <Button onClick={handleBackToBackups}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Backups
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button variant="outline" className="mb-6 bg-transparent" onClick={handleBackToBackups}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Backups
          </Button>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">{manifest.name}</h1>
          <p className="text-lg text-muted-foreground">
            Version {manifest.version_name} • Backup v{manifest.backup_version}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Backup Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Author: {manifest.author}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Updated: {lastUpdatedDate ? format(lastUpdatedDate, "PPP") : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span>Version: {manifest.version_name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Backup v{manifest.backup_version}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{manifest.description}</p>
              </div>

              {manifest.changelog && (
                <div>
                  <h3 className="font-semibold mb-2">Changelog</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{manifest.changelog}</pre>
                  </div>
                </div>
              )}

              {mcOverridesDownloadUrl && (
                <div className="pt-4 border-t">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={handleDownloadBackup}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <span className="animate-spin mr-2">⚙️</span> Downloading...
                      </>
                    ) : (
                      <>
                        <File className="h-4 w-4 mr-2" />
                        Download Backup File
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
