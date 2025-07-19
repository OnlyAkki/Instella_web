import { getGitHubReleases } from "@/lib/github"
import Footer from "@/components/footer"
import DownloadsClient from "./downloads-client"

export default async function DownloadsPage() {
  const releases = await getGitHubReleases("OnlyAbhii", "instella_app")

  return (
    <div className="flex flex-col min-h-screen">
      <DownloadsClient releases={releases} />
      <Footer />
    </div>
  )
}
