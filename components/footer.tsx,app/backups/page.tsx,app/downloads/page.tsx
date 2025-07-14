components / footer.tsx
;("use client")

const FooterWrapper = () => {
  return <div>Footer Component</div>
}

export default FooterWrapper

app / backups / page.tsx
import { getGitHubRepoContents } from "@/lib/github"
import BackupsClient from "./backups-client"
import FooterWrapper from "@/components/footer"

const BackupsPage = () => {
  const repoContents = getGitHubRepoContents()
  return (
    <div>
      <BackupsClient repoContents={repoContents} />
      <FooterWrapper />
    </div>
  )
}

export default BackupsPage;

app / downloads / page.tsx
import { getGitHubReleases } from "@/lib/github"
import DownloadsClient from "./downloads-client"
import FooterWrapper from "@/components/footer"

const DownloadsPage = () => {
  const releases = getGitHubReleases()
  return (
    <div>
      <DownloadsClient releases={releases} />
      <FooterWrapper />
    </div>
  )
}

export default DownloadsPage;
