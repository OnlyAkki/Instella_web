"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">We encountered an unexpected error. Please try again.</p>
        {error.message && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm max-w-lg mx-auto">
            <p className="font-semibold">Error Details:</p>
            <pre className="whitespace-pre-wrap break-all">{error.message}</pre>
          </div>
        )}
        <Button onClick={() => reset()}>Try again</Button>
      </motion.div>
    </div>
  )
}
