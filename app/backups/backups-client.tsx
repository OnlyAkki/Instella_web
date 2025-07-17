"use client"

import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, User, File } from "lucide-react"
import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"
import { useTranslation } from "@/contexts/translation-context"
import { getGitHubRepoContents } from "@/lib/github"

interface GitHubContent {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: "file" | "dir"
  _links: {
    git: string
    self: string
    html: string
  }
}

interface BackupsClientProps {
  backups: GitHubContent[]
}

export default function BackupsClient({ backups }: BackupsClientProps) {
  const { t } = useTranslation()
  const [isNavigating, setIsNavigating] = useState(false)
  const [clientBackups, setClientBackups] = useState<GitHubContent[]>(backups)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Fetch backups data on client side
  useEffect(() => {
    const fetchBackups = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const backupFolders = await getGitHubRepoContents("OnlyAkki", "Instella_Backup")
        const validBackups = backupFolders.filter((item) => item.type === "dir" && item.name !== ".github")
        
        setClientBackups(validBackups)
      } catch (err) {
        console.error("Error fetching backups:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch backups")
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if initial props are empty
    if (backups.length === 0) {
      fetchBackups()
    }
  }, [backups])

  const handleViewBackup = (backupName: string) => {
    setIsNavigating(true)
    router.push(`/backups/view?id=${backupName}`)
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

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <Folder className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">{t("errorLoadingBackups")}</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            {t("retry")}
          </Button>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-muted-foreground">{t("loadingBackups")}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
            {t("backupLibrary")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("backupLibraryDesc")}
          </p>
        </motion.div>

        {clientBackups.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">{t("noBackups")}</h2>
            <p className="text-muted-foreground">{t("checkBackBackups")}</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {clientBackups.map((backup) => (
              <motion.div
                key={backup.name}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 text-primary">
                      <File className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-center">{backup.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{t("communityBackup")}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleViewBackup(backup.name)}
                      disabled={isNavigating}
                    >
                      {isNavigating ? t("loading") : t("viewBackup")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
