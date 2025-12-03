"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wifi, WifiOff } from "lucide-react"

interface OfflineIndicatorProps {
  onStatusChange?: (isOnline: boolean) => void
}

export default function OfflineIndicator({ onStatusChange }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowIndicator(true)
      onStatusChange?.(true)
      setTimeout(() => setShowIndicator(false), 3500)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
      onStatusChange?.(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [onStatusChange])

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ y: -120, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -120, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-40 rounded-full px-6 py-3 font-medium text-sm flex items-center gap-3 shadow-2xl backdrop-blur ${
            isOnline
              ? "bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-700 border border-green-500/50"
              : "bg-gradient-to-r from-orange-500/20 to-orange-400/20 text-orange-700 border border-orange-500/50"
          }`}
        >
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          </motion.div>
          <span className="font-semibold">{isOnline ? "Back Online" : "You are offline"}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
