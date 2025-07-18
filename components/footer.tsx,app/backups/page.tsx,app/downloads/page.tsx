'use client'

import { useTranslation } from "@/contexts/translation-context"

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <p className="text-sm">{t("madeWith")}</p>
    </footer>
  )
}


export const dynamic = "force-dynamic"

import dynamic from "next/dynamic"
import { getGitHubRepoContents } from "@/lib/github"
import BackupsClient from "./backups-client"

const Footer = dynamic(() => import("@/components/footer"), { ssr: false })

export default async function BackupsPage() {
  const folders = await getGitHubRepoContents("OnlyAkki", "Instella_Backup")
  const backups = folders.filter((f) => f.type === "dir" && f.name !== ".github")

  return (
    <div className="flex flex-col min-h-screen">
      <BackupsClient backups={backups} />
      <Footer />
    </div>
  )
}


import dynamic from "next/dynamic"
import { getGitHubReleases } from "@/lib/github"
import DownloadsClient from "./downloads-client"

const Footer = dynamic(() => import("@/components/footer"), { ssr: false })

interface DownloadsPageProps {
  searchParams: { arch?: string; version?: string }
}

export default async function DownloadsPage({ searchParams }: DownloadsPageProps) {
  const releases = await getGitHubReleases("OnlyAbhii", "instella_app")

  return (
    <div className="flex flex-col min-h-screen">
      <DownloadsClient releases={releases} searchParams={searchParams} />
      <Footer />
    </div>
  )
}
