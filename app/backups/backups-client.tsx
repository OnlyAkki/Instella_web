"use client"

import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, User, File, RefreshCw, Clock } from "lucide-react"
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
   const [initialDataLoaded, setInitialDataLoaded] = useState(false)
   const [currentBackups, setCurrentBackups] = useState<GitHubContent[]>(backups)
   const [isRefreshing, setIsRefreshing] = useState(false)
   const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
   const [hasNewBackups, setHasNewBackups] = useState(false)
   const router = useRouter()
   const pathname = usePathname()

   console.log(
     "BackupsClient render: initialDataLoaded =",
     initialDataLoaded,
     "isNavigating =",
     isNavigating,
     "currentBackups.length =",
     currentBackups.length,
     "URL:",
     typeof window !== "undefined" ? window.location.href : "N/A",
   )
   console.log("BackupsClient render: Current backups:", currentBackups)

   const fetchBackupsFromGitHub = async () => {
     try {
       const response = await fetch('https://api.github.com/repos/onlyAkki/Instella_Backup/contents/')
       
       if (!response.ok) {
         throw new Error(`GitHub API error: ${response.status}`)
       }
       
       const data: GitHubContent[] = await response.json()
       
       const backupFolders = data.filter(item => item.type === 'dir')
       
       console.log('Fetched backups from GitHub:', backupFolders)
       return backupFolders
     } catch (error) {
       console.error('Error fetching backups from GitHub:', error)
       return null
     }
   }

   const checkForUpdates = async () => {
     const latestBackups = await fetchBackupsFromGitHub()
     
     if (latestBackups) {
       const hasChanges = latestBackups.length !== currentBackups.length ||
         latestBackups.some(backup => !currentBackups.find(current => current.sha === backup.sha))
       
       if (hasChanges) {
         setHasNewBackups(true)
         return latestBackups
       }
     }
     
     return null
   }

   const handleRefresh = async () => {
     setIsRefreshing(true)
     setHasNewBackups(false)
     
     try {
       const latestBackups = await fetchBackupsFromGitHub()
       
       if (latestBackups) {
         setCurrentBackups(latestBackups)
         setLastUpdated(new Date())
         console.log('Backups refreshed successfully')
       }
     } catch (error) {
       console.error('Error refreshing backups:', error)
     } finally {
       setIsRefreshing(false)
     }
   }

   useEffect(() => {
     if (!backups || backups.length === 0) {
       handleRefresh()
     } else {
       setCurrentBackups(backups)
     }
   }, [])

   useEffect(() => {
     const interval = setInterval(async () => {
       const updates = await checkForUpdates()
       if (updates) {
         console.log('New backups detected!')
       }
     }, 30000)

     return () => clearInterval(interval)
   }, [currentBackups])

   useEffect(() => {
     const handleVisibilityChange = async () => {
       if (!document.hidden) {
         const updates = await checkForUpdates()
         if (updates) {
           console.log('New backups detected on tab focus!')
         }
       }
     }

     document.addEventListener('visibilitychange', handleVisibilityChange)
     return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
   }, [currentBackups])

   useEffect(() => {
     if (!initialDataLoaded && currentBackups.length > 0) {
       console.log("BackupsClient: Initial data loaded. Setting initialDataLoaded to true.")
       setInitialDataLoaded(true)
     }
   }, [currentBackups, initialDataLoaded])

   useEffect(() => {
     console.log("BackupsClient: useEffect for navigation state triggered by pathname change.")
     console.log("  Current pathname in useEffect:", pathname)
     console.log("  Current isNavigating in useEffect:", isNavigating)

     if (isNavigating) {
       const timer = setTimeout(() => {
         console.log("BackupsClient: Setting isNavigating to false after pathname update.")
         setIsNavigating(false)
       }, 50)
       return () => clearTimeout(timer)
     }
   }, [pathname, isNavigating])

   const handleViewBackup = (backupName: string) => {
     console.log(
       `BackupsClient: Attempting to navigate to /backups/view?id=${backupName}. Setting isNavigating to true.`,
     )
     setIsNavigating(true)
     router.push(`/backups/view?id=${backupName}`)
   }

   const handleUpdateNow = async () => {
     const latestBackups = await fetchBackupsFromGitHub()
     if (latestBackups) {
       setCurrentBackups(latestBackups)
       setLastUpdated(new Date())
       setHasNewBackups(false)
     }
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
         {hasNewBackups && (
           <motion.div
             initial={{ opacity: 0, y: -50 }}
             animate={{ opacity: 1, y: 0 }}
             className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg max-w-sm"
           >
             <div className="flex items-center gap-2 mb-2">
               <RefreshCw className="h-4 w-4" />
               <span className="font-semibold">New Backups Available!</span>
             </div>
             <p className="text-sm mb-3">New backup configurations have been added to the repository.</p>
             <div className="flex gap-2">
               <Button
                 size="sm"
                 variant="secondary"
                 onClick={handleUpdateNow}
                 className="text-xs"
               >
                 Update Now
               </Button>
               <Button
                 size="sm"
                 variant="ghost"
                 onClick={() => setHasNewBackups(false)}
                 className="text-xs text-primary-foreground hover:bg-primary-foreground/20"
               >
                 Later
               </Button>
             </div>
           </motion.div>
         )}

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
           
           <div className="flex items-center justify-center gap-4 mt-6">
             <Button
               variant="outline"
               size="sm"
               onClick={handleRefresh}
               disabled={isRefreshing}
               className="flex items-center gap-2"
             >
               <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
               {isRefreshing ? 'Refreshing...' : 'Refresh'}
             </Button>
             
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <Clock className="h-4 w-4" />
               <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
             </div>
           </div>
         </motion.div>

         {initialDataLoaded && currentBackups.length === 0 ? (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
             <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
             <h2 className="text-xl font-semibold mb-2">No Backups Found</h2>
             <p className="text-muted-foreground">No backup configurations found in the repository.</p>
             <Button 
               variant="outline" 
               className="mt-4"
               onClick={handleRefresh}
               disabled={isRefreshing}
             >
               <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
               Try Again
             </Button>
           </motion.div>
         ) : (
           <motion.div
             variants={containerVariants}
             initial="hidden"
             animate="visible"
             className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
           >
             {currentBackups.map((backup, index) => (
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
                       <File className="h-6 w-6" />
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
                       <File className="h-4 w-4 mr-2" />
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
