"use client"

import { useEffect, useState, useCallback } from "react"

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface PWAInstallHandlerContextValue {
  isInstallable: boolean
  handleInstall: () => Promise<void>
  isLoading: boolean
  installationComplete: boolean
}

import { createContext, ReactNode, useContext } from "react"

export const PWAInstallContext = createContext<PWAInstallHandlerContextValue | undefined>(undefined)

export function usePWAInstall() {
  const context = useContext(PWAInstallContext)
  if (context === undefined) {
    throw new Error("usePWAInstall must be used within a PWAInstallProvider")
  }
  return context
}

interface PWAInstallProviderProps {
  children: ReactNode
}

export function PWAInstallProvider({ children }: PWAInstallProviderProps) {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [installationComplete, setInstallationComplete] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired")
      e.preventDefault()
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(beforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      console.log("App installed successfully")
      setIsInstallable(false)
      setDeferredPrompt(null)
      setInstallationComplete(true)
      setTimeout(() => setInstallationComplete(false), 3500)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      console.log("Install prompt not available")
      return
    }

    setIsLoading(true)
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)

      if (outcome === "accepted") {
        setInstallationComplete(true)
        setTimeout(() => setInstallationComplete(false), 3500)
      }

      setDeferredPrompt(null)
      setIsInstallable(false)
    } catch (error) {
      console.error("Error during installation:", error)
    } finally {
      setIsLoading(false)
    }
  }, [deferredPrompt])

  const value: PWAInstallHandlerContextValue = {
    isInstallable,
    handleInstall,
    isLoading,
    installationComplete,
  }

  return <PWAInstallContext.Provider value={value}>{children}</PWAInstallContext.Provider>
}
