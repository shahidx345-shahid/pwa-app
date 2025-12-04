"use client"

import { useEffect } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallHandler() {
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e as BeforeInstallPromptEvent
      console.log("✓ beforeinstallprompt event fired - Install prompt is available!")
      
      // Auto-show the prompt
      if (deferredPrompt) {
        deferredPrompt.prompt().then(() => {
          console.log("✓ Install prompt shown to user")
        }).catch((error) => {
          console.error("✗ Error showing install prompt:", error)
        })
      }
      
      // Listen for user response
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("✓ User accepted the install prompt")
        } else {
          console.log("✗ User dismissed the install prompt")
        }
        deferredPrompt = null
      })
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

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
    }
  }, [])

  return null
}
