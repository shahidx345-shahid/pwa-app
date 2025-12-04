"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Check if service workers are supported
    if (!("serviceWorker" in navigator)) {
      console.log("Service Workers not supported")
      return
    }

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none", // Always check for updates
        })
        console.log("✓ Service Worker registered successfully:", registration)
        
        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute
      } catch (error) {
        console.error("✗ Service Worker registration failed:", error)
      }
    }

    // Wait for page to load before registering
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", registerServiceWorker)
    } else {
      registerServiceWorker()
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", registerServiceWorker)
    }
  }, [])

  return null
}
