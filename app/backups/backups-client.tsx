"use client"

import { motion } from "framer-motion"
import Link from "next/link"
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-muted-foreground">Loading backups...</p>
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

        {backups.length === 0 ? (
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
                <Card className="relative h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
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
                    <Button asChild className="w-full">
                      <Link href={`/backups/view?id=${backup.name}`}>
                        <HardDrive className="h-4 w-4 mr-2" />
                        View Backup
                      </Link>
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
