"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Calendar, AlertTriangle, Tag, HardDrive } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const [downloadingAsset, setDownloadingAsset] = useState<string | null>(null)

  // Find the specific release for this version
  const targetRelease = releases.find(
    (release) =>
      release.tag_name === version ||
      release.tag_name === `v${version}` ||
      release.tag_name === `V${version}` ||
      release.tag_name.replace(/^v/i, "") === version.replace(/^v/i, ""),
  )

  // Check if this is a legacy version (older than V60)
  const versionNumber = Number.parseInt(version.replace(/^v/i, ""))
  const isLegacyVersion = !isNaN(versionNumber) && versionNumber < 60

  // Filter assets based on architecture if specified
  const filteredAssets =
    targetRelease?.assets.filter((asset) => {
      if (!arch) return true

      const assetName = asset.name.toLowerCase()
      if (arch === "32") {
        return assetName.includes("32bit") || assetName.includes("x86")
      } else if (arch === "64") {
        return (
          assetName.includes("64bit") ||
          assetName.includes("x64") ||
          (!assetName.includes("32bit") && !assetName.includes("x86"))
        )
      }
      return true
    }) || []

  const handleDownload = async (asset: GitHubReleaseAsset) => {
    setDownloadingAsset(asset.name)
    try {
      // Create a temporary link to trigger download
      const link = document.createElement("a")
      link.href = asset.browser_download_url
      link.download = asset.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setTimeout(() => setDownloadingAsset(null), 2000)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Legacy Warning */}
        {isLegacyVersion && (
          <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">Legacy Version Warning</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    You are accessing an older version of Instella. This version may contain security vulnerabilities or
                    missing features. We recommend using the latest version for the best experience and security
                    updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <Button variant="outline" onClick={() => router.push("/downloads")} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Latest Version
        </Button>

        {/* Version Info */}
        {targetRelease ? (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Tag className="h-6 w-6 text-muted-foreground" />
                  <CardTitle className="text-2xl font-bold">{targetRelease.tag_name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">V{versionNumber}</Badge>
                    {arch && (
                      <Badge variant="outline" className="gap-1">
                        <HardDrive className="h-3 w-3" />
                        {arch === "32" ? "32-bit" : "64-bit"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Released {formatDate(targetRelease.published_at)}</span>
              </div>
            </CardHeader>

            {targetRelease.body && (
              <CardContent>
                <h3 className="font-semibold mb-3">Release Notes</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{targetRelease.body}</pre>
                </div>
              </CardContent>
            )}
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Version Not Found</h3>
                <p className="text-muted-foreground">Version {version} could not be found in the releases.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Downloads Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Available Downloads
            </CardTitle>
            <CardDescription>
              {arch
                ? `Showing ${arch === "32" ? "32-bit" : "64-bit"} downloads for version ${version}`
                : `All downloads for version ${version}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAssets.length > 0 ? (
              <div className="space-y-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium break-all">{asset.name}</h4>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(asset.size)}</span>
                        {asset.name.includes("Clone") && (
                          <Badge variant="secondary" className="text-xs">
                            Clone
                          </Badge>
                        )}
                        {asset.name.includes("Standard") && (
                          <Badge variant="outline" className="text-xs">
                            Standard
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(asset)}
                      disabled={downloadingAsset === asset.name}
                      className="min-w-[120px] flex-shrink-0 w-full sm:w-auto"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {downloadingAsset === asset.name ? "Downloading..." : "Download"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Downloads Available</h3>
                <p className="text-muted-foreground">
                  {arch
                    ? `No ${arch === "32" ? "32-bit" : "64-bit"} downloads found for this version.`
                    : "No downloads found for this version."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-muted-foreground">
          <p>Made with ❤️ by Instella Team.</p>
        </div>
      </div>
    </div>
  )
}
