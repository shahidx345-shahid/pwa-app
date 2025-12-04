"use client"

import { useState, useEffect } from "react"
import { X, Apple, Download } from "lucide-react"

export function MobileAppDownloadPrompt() {
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

    // Show prompt after 3 seconds if on mobile and not dismissed
    if (isMobileDevice && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [dismissed])

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem("app-download-dismissed", "true")
  }

  // Don't show if not mobile or already dismissed
  if (!isMobile || !showPrompt || dismissed) {
    return null
  }

  const appStoreUrl = "https://apps.apple.com/app/appflow/id123456789" // Replace with your App Store link
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.appflow" // Replace with your Play Store link
  const downloadUrl = isIOS ? appStoreUrl : playStoreUrl

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 animate-in slide-in-from-bottom-5 duration-300 bg-gradient-to-t from-black/20 to-transparent">
      <div className="mx-auto max-w-sm rounded-xl bg-white shadow-2xl overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Header with icon and close */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                {isIOS ? (
                  <Apple className="h-6 w-6 text-white" />
                ) : (
                  <Download className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">Get AppFlow App</p>
                <p className="text-xs text-gray-500">Better experience on mobile</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 px-1">
            Download our native app for the best experience with offline access and faster performance.
          </p>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Download Now
            </a>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
