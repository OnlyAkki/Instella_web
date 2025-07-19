"use client"

import Link from "next/link"
import { Github, Send, Heart } from "lucide-react"
import { useTranslation } from "@/contexts/translation-context"

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t("madeWith")} <Heart className="inline h-4 w-4 text-red-500" /> {t("by")}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="https://github.com/OnlyAbhii/instella_app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://t.me/instellacommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Telegram</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
