"use client"

import { motion } from "framer-motion"
import Footer from "@/components/footer"
import { Wrench, Construction } from "lucide-react"

export default function FlagsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Construction className="h-12 w-12 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            🚧 Under Development 🚧
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-muted-foreground max-w-md mx-auto"
          >
            The Flags page is currently being developed. Check back soon for exciting new features!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <Wrench className="h-4 w-4" />
            <span>Coming Soon</span>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
