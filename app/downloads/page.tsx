"use client"

import { getGitHubReleases } from "@/lib/github"
import Footer from "@/components/footer"
import DownloadsClient from "./downloads-client"

interface DownloadsPageProps {
  searchParams: {
    version?: string
    arch?: string
  }
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
