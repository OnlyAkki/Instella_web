import { getGitHubReleases } from "@/lib/github"
import Footer from "@/components/footer"
import DownloadsClient from "./downloads-client"
import VersionedDownloadsClient from "./versioned-downloads-client"

interface SearchParams {
  version?: string
  arch?: string
}

export default async function DownloadsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const releases = await getGitHubReleases("OnlyAbhii", "instella_app")

  // If version parameter exists, check if it's actually an old version
  if (searchParams.version && releases.length > 0) {
    const latestVersion = releases[0].tag_name
    const requestedVersion = searchParams.version

    // List of versions that should NOT show legacy warning
    const currentVersions = ["V65", "v65", "65", latestVersion, latestVersion.replace("v", ""), "latest"]

    // Check if requested version is current (don't show legacy warning)
    const isCurrentVersion = currentVersions.some((version) => requestedVersion.toLowerCase() === version.toLowerCase())

    // If it's a current version, show normal downloads page
    if (isCurrentVersion) {
      return (
        <div className="flex flex-col min-h-screen">
          <DownloadsClient releases={releases} />
          <Footer />
        </div>
      )
    }

    // Otherwise show versioned client for old versions
    return (
      <div className="flex flex-col min-h-screen">
        <VersionedDownloadsClient version={searchParams.version} arch={searchParams.arch} releases={releases} />
        <Footer />
      </div>
    )
  }

  // Normal downloads page
  return (
    <div className="flex flex-col min-h-screen">
      <DownloadsClient releases={releases} />
      <Footer />
    </div>
  )
}
