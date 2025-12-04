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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) ||
        window.innerWidth <= 768
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired - Install prompt available!")
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Only show on mobile
      if (isMobile) {
        setIsInstallable(true)
        setIsDismissed(false)
        
        // Auto-hide after 2 seconds
        const timer = setTimeout(() => {
          setIsInstallable(false)
        }, 2000)
        
        return () => clearTimeout(timer)
      }
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
      window.removeEventListener("resize", checkMobile)
    }
  }, [isMobile])

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
    setIsInstallable(false)
    setIsDismissed(true)
  }

  // Only show on mobile devices
  if (!isInstallable || isDismissed || !isMobile) {
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
          className="fixed top-1 left-2 right-2 z-50 px-3 py-2 rounded-lg bg-white shadow-lg border border-gray-200 max-w-md"
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="flex-shrink-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Download className="h-5 w-5 text-blue-500" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-xs">Install AppFlow</h3>
              <p className="text-gray-600 text-xs">news-react-project.vercel.app</p>
            </div>

            {/* Install Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInstall}
              disabled={isLoading}
              className="px-3 py-1 bg-orange-500 text-white font-semibold rounded text-xs hover:bg-orange-600 transition-colors disabled:opacity-60 whitespace-nowrap flex-shrink-0"
            >
              {isLoading ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  ⌛
                </motion.span>
              ) : (
                "Install"
              )}
            </motion.button>
          </div>

          {/* Installation success message */}
          <AnimatePresence>
            {isInstalled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 p-2 bg-green-50 rounded flex items-center gap-2 border border-green-200"
              >
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-green-700 text-xs font-medium">App installed successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
