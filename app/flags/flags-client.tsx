"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Flag,
  Search,
  ChevronRight,
  Calendar,
  User,
  Settings,
  ExternalLink,
  ArrowLeft,
  ImageIcon,
  Copy,
  Check,
  Tv,
  Send,
  Play,
  PlusCircle,
  Archive,
  Layout,
  FileText,
  MessageCircle,
  Camera,
  Bot,
  WrenchIcon as Screwdriver,
  Type,
  Dot,
  Palette,
  MoreHorizontal,
} from "lucide-react"
import { useTranslation } from "@/contexts/translation-context"
import { searchFlags } from "@/lib/flags"

interface FlagOption {
  is_enabled: boolean
  delete_media: boolean
  edit_media: boolean
  favorite_media: boolean
  is_redesigned_preview_enabled: boolean
}

interface FlagData {
  id: string
  title: string
  description: string
  source: string
  tags: string[]
  author: string
  date_added: string
  date_removed: string | null
  options: FlagOption
  flag_name?: string // Flag name from manifest.json
}

interface FlagCategory {
  name: string
  path: string
  flags: FlagData[]
  icon?: string
}

interface FlagsClientProps {
  categories: FlagCategory[]
}

// Icon mapping for dynamic rendering with all requested icons
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Tv,
  Send,
  Play,
  PlusCircle,
  Archive,
  Layout,
  FileText,
  ImageIcon,
  User,
  MessageCircle,
  Camera,
  Bot,
  Screwdriver,
  Type,
  Dot,
  Palette,
  MoreHorizontal,
  Flag,
}

export default function FlagsClient({ categories }: FlagsClientProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFlag, setSelectedFlag] = useState<FlagData | null>(null)
  const [copied, setCopied] = useState(false)

  console.log("FlagsClient: Received categories:", categories)
  console.log("FlagsClient: Categories length:", categories.length)

  // Get category and flag from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    const flagId = searchParams.get("flag")

    console.log("FlagsClient: URL params - category:", category, "flagId:", flagId)

    if (category) {
      setSelectedCategory(category)

      if (flagId) {
        const categoryData = categories.find((cat) => cat.name === category)
        const flag = categoryData?.flags.find((f) => f.id === flagId)
        if (flag) {
          setSelectedFlag(flag)
        }
      }
    }
  }, [searchParams, categories])

  // Browser navigation support
  useEffect(() => {
    const handlePopState = () => {
      const currentUrl = new URL(window.location.href)
      const category = currentUrl.searchParams.get("category")
      const flagId = currentUrl.searchParams.get("flag")

      if (!category && !flagId) {
        setSelectedCategory(null)
        setSelectedFlag(null)
      } else if (category && !flagId) {
        setSelectedCategory(category)
        setSelectedFlag(null)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const allFlags = useMemo(() => {
    return categories.flatMap((category) => category.flags)
  }, [categories])

  const filteredFlags = useMemo(() => {
    return searchFlags(allFlags, searchQuery)
  }, [allFlags, searchQuery])

  const selectedCategoryData = useMemo(() => {
    return categories.find((cat) => cat.name === selectedCategory)
  }, [categories, selectedCategory])

  // Calculate total flags for "All" category
  const totalFlags = useMemo(() => {
    return categories.reduce((total, category) => total + category.flags.length, 0)
  }, [categories])

  const handleCopyFlagName = async () => {
    if (selectedFlag?.flag_name) {
      try {
        await navigator.clipboard.writeText(selectedFlag.flag_name)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy flag name:", err)
      }
    }
  }

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === "all") {
      // Show all flags in search results
      setSearchQuery("")
      setSelectedCategory(null)
      setSelectedFlag(null)
      router.push("/flags")
      return
    }

    setSelectedCategory(categoryName)
    setSelectedFlag(null)
    router.push(`/flags?category=${categoryName}`)
  }

  const handleFlagSelect = (flag: FlagData) => {
    setSelectedFlag(flag)
    router.push(`/flags?category=${selectedCategory}&flag=${flag.id}`)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setSelectedFlag(null)
    setSearchQuery("")
    window.history.pushState({}, "", "/flags")
    router.refresh()
  }

  const handleBackToFlags = () => {
    setSelectedFlag(null)
    window.history.pushState({}, "", `/flags?category=${selectedCategory}`)
    router.refresh()
  }

  const handleViewOnTelegram = () => {
    if (selectedFlag?.source) {
      window.open(selectedFlag.source, "_blank", "noopener,noreferrer")
    }
  }

  const handleSearch = () => {
    // Trigger search when search button is clicked
    if (searchQuery.trim()) {
      setSelectedCategory(null)
      setSelectedFlag(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Handle search input change - fix for clearing search results
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // If search is cleared, reset to categories view
    if (!value.trim()) {
      setSelectedCategory(null)
      setSelectedFlag(null)
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

  // Helper function to get category icon
  const getCategoryIcon = (iconName?: string) => {
    const IconComponent = IconMap[iconName || "Flag"] || Flag
    return IconComponent
  }

  // Flag detail view
  if (selectedFlag) {
    return (
      <div className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button variant="outline" className="mb-6 bg-transparent" onClick={handleBackToFlags}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToFlags").replace("{category}", selectedCategory || "")}
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="rounded-full bg-primary/10 p-3 text-primary"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Flag className="h-6 w-6" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{selectedFlag.title}</h1>
                <p className="text-muted-foreground">Flag ID: {selectedFlag.id}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Screenshot Container */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    {t("screenshot")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="https://t.me/instellacommunity/3088" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" size="lg">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t("viewOnTelegram")}
                    </Button>
                  </a>
                  <p className="text-xs text-muted-foreground mt-2 break-all">
                    {t("source")}: {selectedFlag.source}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Flag Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("description")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{selectedFlag.description}</p>
                </CardContent>
              </Card>

              {/* Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t("information")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("author")}:</span>
                    <span className="font-medium">{selectedFlag.author}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("dateAdded")}:</span>
                    <span className="font-medium">{selectedFlag.date_added}</span>
                  </div>
                  {selectedFlag.date_removed && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("dateRemoved")}:</span>
                        <span className="font-medium text-destructive">{selectedFlag.date_removed}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("category")}:</span>
                    <Badge variant="secondary">{selectedCategory}</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <span className="text-muted-foreground">{t("tags")}:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedFlag.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Meta Config Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t("metaConfigSettings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Flag Name Section */}
                {selectedFlag.flag_name && (
                  <>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground">{t("flagName")}:</span>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                        <code className="text-sm font-mono text-foreground select-all">{selectedFlag.flag_name}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-2 flex-shrink-0"
                          onClick={handleCopyFlagName}
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Options */}
                {Object.entries(selectedFlag.options).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</span>
                    <Switch checked={value} disabled />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Category flags view
  if (selectedCategory && selectedCategoryData) {
    const CategoryIcon = getCategoryIcon(selectedCategoryData.icon)

    return (
      <div className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button variant="outline" className="mb-6 bg-transparent" onClick={handleBackToCategories}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToCategories")}
            </Button>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  className="rounded-full bg-primary/10 p-3 text-primary"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <CategoryIcon className="h-8 w-8" />
                </motion.div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl capitalize">
                  {selectedCategory} {t("flags")}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                {selectedCategoryData.flags.length} {t("flagsAvailable")}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {selectedCategoryData.flags.map((flag, index) => (
              <motion.div
                key={flag.id}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group cursor-pointer"
                onClick={() => handleFlagSelect(flag)}
              >
                <Card className="relative h-full overflow-hidden border-2 border-border bg-card backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <motion.div
                        className="rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Flag className="h-5 w-5" />
                      </motion.div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{flag.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">{flag.description}</p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{flag.date_added}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {flag.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {flag.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{flag.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    )
  }

  // Main categories view
  return (
    <div className="flex-1 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
          >
            <Flag className="h-12 w-12 text-primary" />
          </motion.div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">{t("flagsLibrary")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t("flagsLibraryDesc")}</p>

          {/* Search Container - Matching the screenshot design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t("searchFlags")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  className="pl-12 pr-4 py-3 text-base bg-background/50 backdrop-blur border-border/50 rounded-lg"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="px-4 py-3 rounded-lg">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Categories or Search Results */}
        {searchQuery.trim() ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">
              {t("searchResults")} ({filteredFlags.length})
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFlags.map((flag, index) => (
                <motion.div
                  key={flag.id}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="group cursor-pointer"
                  onClick={() => {
                    const category = categories.find((cat) => cat.flags.some((f) => f.id === flag.id))
                    if (category) {
                      setSelectedCategory(category.name)
                      handleFlagSelect(flag)
                    }
                  }}
                >
                  <Card className="relative h-full overflow-hidden border-2 border-border bg-card backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <motion.div
                          className="rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Flag className="h-5 w-5" />
                        </motion.div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{flag.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">{flag.description}</p>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{flag.date_added}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {flag.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {flag.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{flag.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">{t("categories")}</h2>

            {/* Categories Grid - Matching the screenshot layout */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {/* All Category with TV icon */}
              <motion.div
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group cursor-pointer"
                onClick={() => handleCategorySelect("all")}
              >
                <Card className="relative overflow-hidden border border-border bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary transition-colors group-hover:bg-primary/20"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Tv className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2">All</h3>
                    <p className="text-sm text-muted-foreground">{totalFlags} Flag</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Dynamic Categories */}
              {categories.map((category, index) => {
                const CategoryIcon = getCategoryIcon(category.icon)

                return (
                  <motion.div
                    key={category.name}
                    variants={itemVariants}
                    whileHover={{
                      y: -4,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                    className="group cursor-pointer"
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    <Card className="relative overflow-hidden border border-border bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                      <CardContent className="p-6 text-center">
                        <motion.div
                          className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary transition-colors group-hover:bg-primary/20"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <CategoryIcon className="h-6 w-6" />
                        </motion.div>
                        <h3 className="text-lg font-semibold mb-2 capitalize">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.flags.length} Flag</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {categories.length === 0 && !searchQuery && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <Flag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">{t("noCategoriesFound")}</h2>
            <p className="text-muted-foreground">{t("checkBackLaterFlags")}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
