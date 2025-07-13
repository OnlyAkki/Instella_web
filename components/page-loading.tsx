"use client"

import { motion } from "framer-motion"
import LoadingSpinner from "./loading-spinner"

interface PageLoadingProps {
  message?: string
}

export default function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <LoadingSpinner size="lg" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-muted-foreground"
          >
            {message}
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
