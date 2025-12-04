"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "./ui/button"

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <Download className="h-8 w-8 text-white" />
          </div>

          {/* Text */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Install AppFlow</h2>
            <p className="text-sm text-muted-foreground">
              Get instant access to our app with offline capabilities and lightning-fast performance. Install directly to your home screen!
            </p>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col gap-3 pt-4">
            <Button
              onClick={handleInstall}
              className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Install Now
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
