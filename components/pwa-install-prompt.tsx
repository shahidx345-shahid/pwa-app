"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      console.log("Install prompt available")
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    const handleAppInstalled = () => {
      console.log("App installed!")
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response: ${outcome}`)

      if (outcome === "accepted") {
        setIsInstalled(true)
      }
      setShowPrompt(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error("Installation error:", error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  // Don't show if installed, no prompt available, or not on mobile
  if (isInstalled || !showPrompt || !deferredPrompt || !isMobile) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 animate-in slide-in-from-bottom-5 duration-300">
      <div className="mx-auto max-w-sm rounded-lg bg-white shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 p-3">
          {/* Icon */}
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
            <Download className="h-5 w-5 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Install AppFlow</p>
            <p className="text-xs text-gray-600">Add to your home screen</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
