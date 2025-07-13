"use client"

import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, HardDrive, User } from "lucide-react"
import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"

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
  const [isNavigating, setIsNavigating] = useState(false)
  const [initialDataLoaded, setInitialDataLoaded] = useState(false) // New state to track initial data load
  const router = useRouter()
  const pathname = usePathname()

  // Log component render state
  console.log(
    "BackupsClient render: initialDataLoaded =",
    initialDataLoaded,
    "isNavigating =",
    isNavigating,
    "backups.length =",
    backups.length,
    "URL:",
    typeof window !== "undefined" ? window.location.href : "N/A",
  )

  // Effect to set initialDataLoaded once backups prop is received
  useEffect(() => {
    if (!initialDataLoaded && backups) {
      // Check if backups is not null/undefined
      console.log("BackupsClient: Initial data loaded. Setting initialDataLoaded to true.")
      setInitialDataLoaded(true)
    }
  }, [backups, initialDataLoaded])

  // Effect to reset isNavigating when pathname changes (navigation completes)
  useEffect(() => {
    console.log("BackupsClient: useEffect for navigation state triggered by pathname change.")
    console.log("  Current pathname in useEffect:", pathname)
    console.log("  Current isNavigating in useEffect:", isNavigating)

    if (isNavigating) {
      const timer = setTimeout(() => {
        console.log("BackupsClient: Setting isNavigating to false after pathname update.")
        setIsNavigating(false)
      }, 50) // Small delay to ensure router state is fully updated
      return () => clearTimeout(timer)
    }
  }, [pathname, isNavigating]) // Depend on pathname and isNavigating

  const handleViewBackup = (backupName: string) => {
    console.log(
      `BackupsClient: Attempting to navigate to /backups/view?id=${backupName}. Setting isNavigating to true.`,
    )
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

  // Show loading spinner if initial data hasn't loaded OR if a client-side navigation is in progress
  if (!initialDataLoaded || isNavigating) {
    console.log(
      "BackupsClient: Showing loading state. !initialDataLoaded:",
      !initialDataLoaded,
      "isNavigating:",
      isNavigating,
    )
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-muted-foreground">{isNavigating ? "Loading backup..." : "Loading backups..."}</p>
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
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">Backup Library</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse and download community-created backups for Instella App.
          </p>
        </motion.div>

        {/* Only show "No Backups Found" if initial data has loaded AND there are no backups */}
        {initialDataLoaded && backups.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Backups Found</h2>
            <p className="text-muted-foreground">Check back later for community backups.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {backups.map((backup, index) => (
              <motion.div
                key={backup.name}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group"
              >
                <Card className="relative h-full overflow-hidden border-2 border-border bg-card backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader className="pb-4">
                    <motion.div
                      className="mx-auto mb-4 rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <HardDrive className="h-6 w-6" />
                    </motion.div>
                    <CardTitle className="text-lg text-center">{backup.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Community Backup</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      View details and download this backup configuration.
                    </p>
                    <Button className="w-full" onClick={() => handleViewBackup(backup.name)} disabled={isNavigating}>
                      <HardDrive className="h-4 w-4 mr-2" />
                      {isNavigating ? "Loading..." : "View Backup"}
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
