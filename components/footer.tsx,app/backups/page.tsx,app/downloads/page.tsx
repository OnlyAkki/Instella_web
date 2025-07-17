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

// app/backups/backups-client.tsx
'use client'

import { TranslationProvider } from "@/contexts/translation-context"
import Footer from "@/components/footer"

export default function BackupsClient({ backups }: { backups: any[] }) {
  return (
    <TranslationProvider>
      <main className="flex-1">
        {/* Your backups content here */}
        {backups.map(backup => (
          <div key={backup.name}>{backup.name}</div>
        ))}
      </main>
      <Footer />
    </TranslationProvider>
  )
}

// app/backups/page.tsx
export const dynamic = "force-dynamic"
import { getGitHubRepoContents } from "@/lib/github"
import BackupsClient from "./backups-client"

export default async function BackupsPage() {
  const folders = await getGitHubRepoContents("OnlyAkki", "Instella_Backup")
  const backups = folders.filter((f) => f.type === "dir" && f.name !== ".github")

  return (
    <div className="flex flex-col min-h-screen">
      <BackupsClient backups={backups} />
    </div>
  )
}
