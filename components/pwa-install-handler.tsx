"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallHandler() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallBanner(true)
      console.log("✓ Install prompt available - showing banner")
    }

    const handleAppInstalled = () => {
      console.log("✓ App installed!")
      setShowInstallBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Log manifest and service worker
    fetch("/manifest.json")
      .then((res) => res.ok ? res.json() : null)
      .then((manifest) => {
        if (manifest) console.log("✓ Manifest loaded:", manifest.name)
      })
      .catch(() => console.error("✗ Manifest failed"))

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        if (regs.length > 0) console.log("✓ Service Worker active")
      })
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`Install: ${outcome}`)
      setShowInstallBanner(false)
    } catch (error) {
      console.error("Install error:", error)
    }
  }

  if (!showInstallBanner || !deferredPrompt) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-40 p-3 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Install AppFlow</p>
          <p className="text-xs opacity-90">Add to your home screen</p>
        </div>
        <button
          onClick={handleInstallClick}
          className="px-4 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          Install
        </button>
      </div>
    </div>
  )
}
