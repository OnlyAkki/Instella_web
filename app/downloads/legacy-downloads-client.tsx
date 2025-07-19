"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, AlertTriangle, Clock, Cpu } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LegacyDownloadsClientProps {
  version: string
  arch?: string
  releases: any[]
}

export default function LegacyDownloadsClient({ version, arch, releases }: LegacyDownloadsClientProps) {
  const [selectedArch, setSelectedArch] = useState(arch || "64")

  // Legacy version data - you can expand this with actual historical data
  const legacyVersions: Record<
    string,
    {
      title: string
      description: string
      features: string[]
      downloadUrl: string
      size: string
      date: string
      deprecated?: boolean
    }
  > = {
    "23": {
      title: "Instella v2.3 Legacy",
      description: "Classic version with basic Instagram features",
      features: ["Basic Instagram functionality", "Story viewing", "Direct messaging", "Photo/Video upload"],
      downloadUrl: "#",
      size: "45 MB",
      date: "2023-06-15",
      deprecated: true,
    },
    "22": {
      title: "Instella v2.2 Legacy",
      description: "Early version with limited features",
      features: ["Photo viewing", "Basic profile access", "Limited story support"],
      downloadUrl: "#",
      size: "38 MB",
      date: "2023-05-20",
      deprecated: true,
    },
    "21": {
      title: "Instella v2.1 Legacy",
      description: "Initial public release",
      features: ["Basic photo browsing", "Profile viewing", "Simple interface"],
      downloadUrl: "#",
      size: "32 MB",
      date: "2023-04-10",
      deprecated: true,
    },
  }

  const currentVersion = legacyVersions[version]

  if (!currentVersion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Version {version} not found. Please check the version number and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Legacy Version Warning */}
      <Alert className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Legacy Version Access:</strong> You are viewing an archived version of Instella. This version is no
          longer supported and may have security vulnerabilities.
          <a href="/downloads" className="underline ml-1 hover:text-amber-900 dark:hover:text-amber-100">
            Download the latest version instead
          </a>
        </AlertDescription>
      </Alert>

      {/* Version Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold">{currentVersion.title}</h1>
          <Badge variant="outline" className="text-xs">
            LEGACY
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">{currentVersion.description}</p>
        <p className="text-sm text-muted-foreground mt-2">Released: {currentVersion.date}</p>
      </div>

      {/* Architecture Selection */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={selectedArch === "32" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedArch("32")}
            className="flex items-center gap-2"
          >
            <Cpu className="h-4 w-4" />
            32-bit
          </Button>
          <Button
            variant={selectedArch === "64" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedArch("64")}
            className="flex items-center gap-2"
          >
            <Cpu className="h-4 w-4" />
            64-bit
          </Button>
        </div>
      </div>

      {/* Download Card */}
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download {currentVersion.title} ({selectedArch}-bit)
          </CardTitle>
          <CardDescription>
            File size: {currentVersion.size} • Architecture: {selectedArch}-bit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full mb-4" size="lg" disabled={currentVersion.deprecated}>
            <Download className="mr-2 h-4 w-4" />
            {currentVersion.deprecated ? "Download Unavailable" : "Download APK"}
          </Button>

          {currentVersion.deprecated && (
            <p className="text-sm text-muted-foreground text-center">
              This legacy version is no longer available for download due to security concerns.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Features in this version</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentVersion.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Version Navigation */}
      <div className="flex justify-center mt-8 gap-4">
        {Object.keys(legacyVersions).map((v) => (
          <Button
            key={v}
            variant={v === version ? "default" : "outline"}
            size="sm"
            onClick={() => {
              const params = new URLSearchParams()
              params.set("version", v)
              if (arch) params.set("arch", arch)
              window.location.href = `/downloads?${params.toString()}`
            }}
          >
            v{v}
          </Button>
        ))}
      </div>
    </div>
  )
}
