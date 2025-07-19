"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, AlertTriangle, Calendar, Tag, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import LoadingSpinner from "@/components/loading-spinner"
import Link from "next/link"

interface GitHubReleaseAsset {
  browser_download_url: string
  name: string
  size: number
  content_type: string
}

interface GitHubRelease {
  tag_name: string
  name: string | null
  body: string | null
  assets: GitHubReleaseAsset[]
  published_at: string
}

interface VersionedDownloadsClientProps {
  version: string
  arch?: string
  releases: GitHubRelease[]
}

export default function VersionedDownloadsClient({ version, arch, releases }: VersionedDownloadsClientProps) {
  const [downloadingAsset, setDownloadingAsset] = useState<string | null>(null)

  // Find the specific version
  const targetRelease = releases.find(
    (release) =>
      release.tag_name === version ||
      release.tag_name === `{version}` ||
      release.tag_name === `{version}` ||
      release.name?.includes(version),
  )

  // List of versions that should NOT show legacy warning
  const currentVersions = ["V65", "v65", "65"]
  const latestRelease = releases[0]

  // Check if this is actually a legacy version
  const isLegacyVersion =
    targetRelease &&
    latestRelease &&
    targetRelease.tag_name !== latestRelease.tag_name &&
    !currentVersions.some((v) => version.toLowerCase() === v.toLowerCase())

  const handleDownload = (assetName: string, downloadUrl: string) => {
    setDownloadingAsset(assetName)
    window.open(downloadUrl, "_blank", "noopener,noreferrer")
    setTimeout(() => setDownloadingAsset(null), 2000)
  }

  const getFilteredAssets = () => {
    if (!targetRelease) return []

    let filteredAssets = targetRelease.assets.filter((asset) => asset.name.endsWith(".apk"))

    if (arch) {
      filteredAssets = filteredAssets.filter((asset) => {
        const assetName = asset.name.toLowerCase()
        if (arch === "32") {
          return assetName.includes("32") || assetName.includes("x86")
        } else if (arch === "64") {
          return assetName.includes("64") || assetName.includes("arm64") || assetName.includes("armv8")
        }
        return true
      })
    }

    return filteredAssets
  }

  if (!targetRelease) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-2xl font-bold mb-4">Version {version} Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested version could not be found.</p>
          <Button asChild>
            <Link href="/downloads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Downloads
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  const filteredAssets = getFilteredAssets()

  return (
    <div className="flex-1 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Warning Banner - Only show for legacy versions */}
        {isLegacyVersion && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Legacy Version</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      You are viewing version {version}. This is an older release that may not have the latest features
                      or security updates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/downloads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Latest Version
            </Link>
          </Button>
        </motion.div>

        {/* Version Info */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Tag className="h-5 w-5" />
                {targetRelease.name || `Instella App ${targetRelease.tag_name}`}
                <Badge variant={isLegacyVersion ? "secondary" : "default"}>
                  {isLegacyVersion ? `${version}` : "Current"}
                </Badge>
                {arch && <Badge variant="outline">{arch}-bit</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Released {format(new Date(targetRelease.published_at), "PPP")}</span>
              </div>

              {targetRelease.body && (
                <div>
                  <h3 className="font-semibold mb-2">Release Notes</h3>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border">
                      {targetRelease.body}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Downloads */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Available Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAssets.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No downloads available for the specified criteria.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredAssets.map((asset, index) => {
                    const isDownloading = downloadingAsset === asset.name
                    const isClone = asset.name.toLowerCase().includes("clone")

                    return (
                      <motion.div
                        key={asset.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{asset.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{(asset.size / 1024 / 1024).toFixed(1)} MB</span>
                            {isClone && (
                              <Badge variant="outline" className="text-xs">
                                Clone
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(asset.name, asset.browser_download_url)}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
