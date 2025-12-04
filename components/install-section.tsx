"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, CheckCircle } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setIsLoading(true)
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setIsInstalled(true)
      }
      setCanInstall(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error("Installation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="install" className="w-full px-2 sm:px-4 py-16 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="mb-3 sm:mb-4 text-2xl sm:text-5xl font-bold text-foreground"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            Install AppFlow Today
          </motion.h2>
          <p className="mb-8 sm:mb-12 text-sm sm:text-lg text-muted-foreground text-balance">
            Get instant access to our app without the app store hassle
          </p>

          <motion.div
            whileHover={{ scale: canInstall ? 1.05 : 1 }}
            whileTap={{ scale: canInstall ? 0.95 : 1 }}
            onClick={handleInstall}
            className="relative inline-block"
          >
            <button
              disabled={isLoading || isInstalled || !canInstall}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 sm:px-12 py-2 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-2xl transition-all disabled:opacity-60"
            >
              {/* Background glow effect */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary to-accent blur-xl"
                animate={isLoading ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Spinner */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 1 : 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
              </motion.div>

              {/* Button content */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  {isInstalled ? (
                    <>
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Installation Complete!</span>
                      <span className="sm:hidden">Installed!</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Install AppFlow</span>
                      <span className="sm:hidden">Install</span>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isInstalled ? 1 : 0, y: isInstalled ? 0 : 10 }}
            transition={{ duration: 0.4 }}
            className="mt-4 text-xs sm:text-sm text-accent font-medium"
          >
            ✓ App installed successfully! You can now access it from your home screen.
          </motion.p>

          {!canInstall && !isInstalled && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-4 text-xs sm:text-sm text-muted-foreground"
            >
              Install option will appear when the app is ready
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
