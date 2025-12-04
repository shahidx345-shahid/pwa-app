"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, CheckCircle, X } from "lucide-react"

export default function PWAInstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired - Install prompt available!")
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
      setIsDismissed(false)
    }

    const handleAppInstalled = () => {
      console.log("App was installed successfully")
      setIsInstallable(false)
      setDeferredPrompt(null)
      setIsInstalled(true)
      setTimeout(() => setIsInstalled(false), 3500)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Check if app is running as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("App is running as PWA")
      setIsInstallable(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log("Install prompt not available")
      return
    }

    setIsLoading(true)

    try {
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for the user's choice
      const { outcome } = await deferredPrompt.userChoice

      console.log(`User response to the install prompt: ${outcome}`)

      if (outcome === "accepted") {
        setIsInstalled(true)
        setTimeout(() => setIsInstalled(false), 3500)
        setIsInstallable(false)
      }

      // Clear the deferred prompt for next time
      setDeferredPrompt(null)
    } catch (error) {
      console.error("Error during installation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    // Can re-show after some time or user action
    setTimeout(() => setIsDismissed(false), 30000) // 30 seconds
  }

  if (!isInstallable || isDismissed) {
    return null
  }

  return (
    <AnimatePresence>
      {isInstallable && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/95 to-accent/95 shadow-2xl backdrop-blur border border-white/20 max-w-sm w-full sm:w-auto"
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="flex-shrink-0"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Download className="h-6 w-6 text-white" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm sm:text-base">Install AppFlow</h3>
              <p className="text-white/80 text-xs sm:text-sm">Get instant access without the app store</p>
            </div>

            {/* Install Button */}
            <div className="flex gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstall}
                disabled={isLoading}
                className="px-3 sm:px-4 py-2 bg-white text-primary font-semibold rounded-lg text-xs sm:text-sm hover:bg-white/90 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {isLoading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                    ⌛
                  </motion.span>
                ) : (
                  "Install"
                )}
              </motion.button>

              {/* Dismiss Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDismiss}
                className="px-2 sm:px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Installation success message */}
          <AnimatePresence>
            {isInstalled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 p-3 bg-white/20 rounded-lg flex items-center gap-2"
              >
                <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-white text-sm font-medium">App installed successfully! Check your home screen.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
