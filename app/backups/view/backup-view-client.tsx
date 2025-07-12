"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Calendar, User, Tag, FileText } from "lucide-react"
import { format } from "date-fns"

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
  const manifest = manifestData?.manifest

  if (error || !manifest) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || `Could not load backup details for "${backupId}"`}</h1>
          <p className="text-muted-foreground mb-6">The backup might not exist or there was an error loading it.</p>
          <Button asChild>
            <Link href="/backups">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Backups
            </Link>
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
          <Button variant="outline" asChild className="mb-6 bg-transparent">
            <Link href="/backups">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Backups
            </Link>
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
                  <span>Updated: {format(new Date(manifest.last_updated), "PPP")}</span>
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
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href={mcOverridesDownloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download Backup File
                    </Link>
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
