"use client"

import { useState, useEffect } from "react"
import { Download, CheckCircle, Share2 } from "lucide-react"
import { Button } from "./ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      console.log("Install prompt event fired")
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log("App installed!")
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    // Check if running as standalone app
    const handleDisplayModeChange = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    window.matchMedia("(display-mode: standalone)").addEventListener("change", handleDisplayModeChange)

    // Initial check
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

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response: ${outcome}`)

      if (outcome === "accepted") {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
    } catch (error) {
      console.error("Installation error:", error)
    }
  }

  const handleIOSInstall = () => {
    setShowIOSPrompt(true)
  }

  // Only show if not installed
  if (isInstalled) {
    return (
      <Button className="gap-2 bg-green-600 hover:bg-green-700">
        <CheckCircle className="h-4 w-4" />
        App Installed
      </Button>
    )
  }

  // iOS users
  if (isIOS) {
    return (
      <div className="flex flex-col gap-2">
        <Button 
          onClick={handleIOSInstall}
          className="gap-2 bg-blue-600 hover:bg-blue-700 w-full"
        >
          <Share2 className="h-4 w-4" />
          Install on iOS
        </Button>
        {showIOSPrompt && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            Tap the Share button, then select "Add to Home Screen"
          </div>
        )}
      </div>
    )
  }

  // Android/Desktop - show if prompt available
  if (deferredPrompt) {
    return (
      <Button 
        onClick={handleInstall}
        className="gap-2 bg-primary hover:bg-primary/90"
      >
        <Download className="h-4 w-4" />
        Install App
      </Button>
    )
  }

  // Fallback - always show install hint
  return (
    <Button 
      variant="outline"
      className="gap-2"
      onClick={() => console.log("Install prompt not available yet")}
      disabled
    >
      <Download className="h-4 w-4" />
      Installing...
    </Button>
  )
}
