"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallHandler() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      console.log("✓ beforeinstallprompt event fired - Install prompt is available!")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Auto-trigger install prompt after short delay (user sees page = user gesture implied)
    const timer = setTimeout(() => {
      if (deferredPrompt) {
        deferredPrompt.prompt().then(() => {
          console.log("✓ Install prompt shown to user")
        }).catch((error) => {
          console.error("✗ Error showing install prompt:", error)
        })
      }
    }, 2000)

    // Log manifest loading
    fetch("/manifest.json")
      .then((res) => {
        if (res.ok) {
          console.log("✓ Manifest.json loaded successfully")
          return res.json()
        } else {
          console.error("✗ Manifest.json failed to load:", res.status)
        }
      })
      .then((manifest) => {
        console.log("✓ Manifest content:", manifest)
      })
      .catch((error) => {
        console.error("✗ Manifest fetch error:", error)
      })

    // Log service worker status
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          console.log("✓ Service Worker registered:", registrations[0])
        } else {
          console.log("✗ No Service Worker registered yet")
        }
      })
    } else {
      console.error("✗ Service Workers not supported")
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      clearTimeout(timer)
    }
  }, [deferredPrompt])

  return null
}
