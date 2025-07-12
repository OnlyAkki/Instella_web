"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  index: number
}

export default function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="group"
    >
      <Card className="relative h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <motion.div
            className="mb-4 rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
