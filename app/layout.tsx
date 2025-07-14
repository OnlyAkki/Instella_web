import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TranslationProvider } from "@/contexts/translation-context"
import { cn } from "@/lib/utils"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Instella App - Best iOS-style Instagram for Android",
  description:
    "Experience Instagram like never before with Instella App - featuring faster updates, 32-bit support, clone functionality, and ad-free experience.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <TranslationProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
            <Header />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}
