"use client"

import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mx-auto"
        >
          <Loader2 className="h-16 w-16 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-bold">Loading...</h1>
        <p className="text-muted-foreground">Please wait while we fetch the data.</p>
      </motion.div>
    </div>
  )
}
