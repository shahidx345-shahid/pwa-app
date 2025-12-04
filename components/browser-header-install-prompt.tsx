"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"

export function BrowserHeaderInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if mobile device
    const userAgent = navigator.userAgent
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isIOSDevice = /iPhone|iPad|iPod/.test(userAgent)
    
    setIsMobile(isMobileDevice)
    setIsIOS(isIOSDevice)

    // Show prompt immediately on mobile if not dismissed
    if (isMobileDevice && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [dismissed])

  const handleInstall = () => {
    const isIOSDevice = /iPhone|iPad|iPod/.test(navigator.userAgent)
    
    if (isIOSDevice) {
      // iOS - direct to App Store
      window.open("https://apps.apple.com/app/appflow/id123456789", "_blank")
    } else {
      // Android - direct to Play Store
      window.open("https://play.google.com/store/apps/details?id=com.appflow", "_blank")
    }
    
    handleDismiss()
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem("install-prompt-dismissed", "true")
  }

  if (!isMobile || !showPrompt || dismissed) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] animate-in slide-in-from-top duration-300">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Icon and Text */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                <Download className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Install AppFlow</p>
                <p className="text-xs text-gray-500 hidden sm:block">Get the app on your home screen</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
