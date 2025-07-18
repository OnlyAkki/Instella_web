// components/footer.tsx
'use client'

import { useTranslation } from "@/contexts/translation-context"

export default function Footer() {
  // Safe default values if translation context isn't available
  let t = (key: string) => key;
  try {
    const translation = useTranslation();
    t = translation.t || t;
  } catch (e) {
    console.warn("Translation context not available:", e);
  }

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <p className="text-sm">{t("madeWith")}</p>
    </footer>
  )
}

'use client'

import { TranslationProvider } from "@/contexts/translation-context"
import Footer from "@/components/footer"

// Define the expected shape of a backup object
interface Backup {
  name: string;
  path: string;
  html_url?: string; // Optional, for linking to GitHub
  // Add other relevant properties from getGitHubRepoContents if needed
}

interface BackupsClientProps {
  backups: Backup[];
}

export default function BackupsClient({ backups }: BackupsClientProps) {
  return (
    <TranslationProvider>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Backups</h1>
        {backups.length === 0 ? (
          <p className="text-gray-500">No backups found.</p>
        ) : (
          <ul className="space-y-4">
            {backups.map(backup => (
              <li key={backup.name} className="border-b pb-2">
                <a
                  href={backup.html_url || `#`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {backup.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </TranslationProvider>
  )
}

// app/backups/page.tsx
export const dynamic = "force-dynamic"
import { getGitHubRepoContents } from "@/lib/github"
import DownloadsClient from "./downloads-client"

export default async function DownloadsPage() {
  const releases = await getGitHubRepoContents("OnlyAbhii", "instella_app", "releases")
  return (
    <div className="flex flex-col min-h-screen">
      <DownloadsClient releases={releases} />
    </div>
  )
}
