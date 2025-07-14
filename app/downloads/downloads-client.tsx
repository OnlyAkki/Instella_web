"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Triangle, Smartphone, Calendar, Tag, FileText } from "lucide-react"
import { format } from "date-fns"
import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"
import { useTranslation } from "@/contexts/translation-context"

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

interface DownloadsClientProps {
  releases: GitHubRelease[]
}

export default function DownloadsClient({ releases }: DownloadsClientProps) {
  const { t } = useTranslation()
  const [isNavigating, setIsNavigating] = useState(false)
  const [downloadingAsset, setDownloadingAsset] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedArch = searchParams.get("arch")

  const latestRelease = releases.length > 0 ? releases[0] : null

  const [isLoading, setIsLoading] = useState(releases.length === 0)

  console.log(
    "DownloadsClient render: selectedArch =",
    selectedArch,
    "isNavigating =",
    isNavigating,
    "URL:",
    typeof window !== "undefined" ? window.location.href : "N/A",
  )

  useEffect(() => {
    if (releases.length > 0) {
      setIsLoading(false)
    }
  }, [releases])

  useEffect(() => {
    console.log("DownloadsClient: useEffect for navigation state triggered.")
    console.log("  Current selectedArch in useEffect:", selectedArch)
    console.log("  Current isNavigating in useEffect:", isNavigating)

    if (isNavigating) {
      console.log("DownloadsClient: Navigation completed. Setting isNavigating to false.")
      setIsNavigating(false)
    }
  }, [selectedArch])

  const handleArchSelection = (arch: string) => {
    console.log(`DownloadsClient: Selecting architecture: ${arch}. Setting isNavigating to true.`)
    setIsNavigating(true)
    router.push(`/downloads?arch=${arch}`)
  }

  const getAPKsForArch = (arch: string) => {
    const relevantAPKs: { asset: GitHubReleaseAsset; release: GitHubRelease }[] = []

    releases.forEach((release) => {
      release.assets.forEach((asset) => {
        if (asset.name.endsWith(".apk")) {
          const assetName = asset.name.toLowerCase()
          const is32bit = assetName.includes("32") || assetName.includes("x86")
          const is64bit =
            !is32bit && (assetName.includes("64") || assetName.includes("arm64") || assetName.includes("armv8"))

          if ((arch === "32" && is32bit) || (arch === "64" && is64bit)) {
            relevantAPKs.push({ asset, release })
          }
        }
      })
    })

    relevantAPKs.sort((a, b) => new Date(b.release.published_at).getTime() - new Date(a.release.published_at).getTime())

    return relevantAPKs
  }

  const getArchRelease = (arch: string) => {
    const apks = getAPKsForArch(arch)
    return apks.length > 0 ? apks[0].release : latestRelease
  }

  const handleDownload = (assetName: string, downloadUrl: string) => {
    setDownloadingAsset(assetName)
    window.open(downloadUrl, "_blank", "noopener,noreferrer")
    setTimeout(() => setDownloadingAsset(null), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  if (isLoading || isNavigating) {
    console.log("DownloadsClient: Showing loading state. isLoading:", isLoading, "isNavigating:", isNavigating)
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-muted-foreground">{isNavigating ? t("loading") : t("loadingReleases")}</p>
        </motion.div>
      </div>
    )
  }

  if (!latestRelease) {
    console.log("DownloadsClient: No latest release found.")
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("noReleases")}</h1>
          <p className="text-muted-foreground">{t("checkBackLater")}</p>
        </motion.div>
      </div>
    )
  }

  const allArchApks = getAPKsForArch(selectedArch || "")
  const latestStandardApk = allArchApks.find((item) => !item.asset.name.toLowerCase().includes("clone"))
  const latestCloneApk = allArchApks.find((item) => item.asset.name.toLowerCase().includes("clone"))

  const apksToDisplay = []
  if (latestStandardApk) apksToDisplay.push(latestStandardApk)
  if (latestCloneApk) apksToDisplay.push(latestCloneApk)

  apksToDisplay.sort((a, b) => {
    const aIsClone = a.asset.name.toLowerCase().includes("clone")
    const bIsClone = b.asset.name.toLowerCase().includes("clone")
    if (aIsClone && !bIsClone) return 1
    if (!aIsClone && bIsClone) return -1
    return 0
  })

  console.log("DownloadsClient: Rendering main content. selectedArch:", selectedArch)

  return (
    <div className="flex-1 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {!selectedArch ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <Card className="group relative h-full overflow-hidden border-2 border-border bg-card backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    className="mx-auto mb-4 rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary/20"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Smartphone className="h-8 w-8" />
                  </motion.div>
                  <CardTitle className="text-2xl">{t("version32bit")}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{t("compatibleOlder")}</p>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleArchSelection("32")}
                    disabled={isNavigating}
                  >
                    {isNavigating ? t("loading") : t("select32bit")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="group relative h-full overflow-hidden border-2 border-border bg-card backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    className="mx-auto mb-4 rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary/20"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Triangle className="h-8 w-8" />
                  </motion.div>
                  <CardTitle className="text-2xl">{t("version64bit")}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{t("recommendedModern")}</p>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleArchSelection("64")}
                    disabled={isNavigating}
                  >
                    {isNavigating ? t("loading") : t("select64bit")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedArch}
                  {t("versionSelected")}
                </h2>
                <p className="text-muted-foreground">{t("chooseBetween")}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {apksToDisplay.map(({ asset }, index) => {
                  const isClone = asset.name.toLowerCase().includes("clone")
                  const isDownloading = downloadingAsset === asset.name

                  return (
                    <motion.div
                      key={asset.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="group relative overflow-hidden border-2 border-border bg-card backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">
                              {isClone ? t("cloneVersion") : t("standardVersion")}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {(asset.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">
                            {isClone ? t("runMultiple") : t("standardSingle")}
                          </p>
                          <Button
                            className="w-full"
                            onClick={() => handleDownload(asset.name, asset.browser_download_url)}
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                {t("downloading")}
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                {isClone ? t("downloadClone") : t("downloadStandard")}
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {(() => {
                const archRelease = getArchRelease(selectedArch || "")
                const totalAPKsInRelease = archRelease
                  ? archRelease.assets.filter((asset) => asset.name.endsWith(".apk")).length
                  : 0

                return (
                  <Card className="border-2 border-border bg-card backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Instella App {archRelease?.tag_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {t("released")} {archRelease ? format(new Date(archRelease.published_at), "PPP") : t("na")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>
                            {totalAPKsInRelease} {t("filesAvailable")}
                          </span>
                        </div>
                      </div>

                      {archRelease?.body && (
                        <div>
                          <h3 className="font-semibold mb-2">{t("releaseNotes")}</h3>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border">
                              {archRelease.body}
                            </pre>
                          </div>
                        </div>
                      )}

                      {releases.length > 1 && (
                        <div>
                          <h3 className="font-semibold mb-4">{t("otherVersions")}</h3>
                          <div className="flex flex-wrap gap-2">
                            {releases.slice(1, 6).map((release) => (
                              <Button key={release.tag_name} variant="outline" size="sm" asChild>
                                <Link href={`/downloads?arch=${selectedArch}&version=${release.tag_name}`}>
                                  {release.tag_name}
                                </Link>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })()}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
