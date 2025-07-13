"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import FeatureCard from "@/components/feature-card"
import Footer from "@/components/footer"
import { Rocket, Brain, Package, XCircle, Download } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Faster Updates",
      description: "Get the latest features and bug fixes delivered quickly to your device.",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "32-bit Support",
      description: "Compatible with a wider range of Android devices, including older hardware.",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Clone Support",
      description: "Run multiple instances of Instagram on a single device seamlessly.",
    },
    {
      icon: <XCircle className="h-6 w-6" />,
      title: "Ad-Free Experience",
      description: "Enjoy Instagram without interruptions from advertisements.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Instella App
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The Best iOS-style Instagram for Android!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button asChild size="lg" className="group relative overflow-hidden px-8 py-6 text-lg font-semibold">
                <Link href="/downloads">
                  <motion.span
                    className="relative z-10 flex items-center gap-2"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Download Now
                    <Download className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Why Choose Instella?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience Instagram like never before with our enhanced features and optimizations.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
