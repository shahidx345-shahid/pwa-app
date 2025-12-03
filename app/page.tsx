"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import InstallSection from "@/components/install-section"
import OfflineIndicator from "@/components/offline-indicator"
import StatsSection from "@/components/stats-section"
import TestimonialsSection from "@/components/testimonials-section"
import Footer from "@/components/footer"
import CTASection from "@/components/cta-section"

export default function Home() {
  const [isOnline, setIsOnline] = useState(true)

  const handleOnlineStatus = (online: boolean) => {
    setIsOnline(online)
  }

  return (
    <div className="w-full overflow-x-hidden bg-gradient-to-b from-background to-muted">
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <FeaturesSection />
        <InstallSection />
        <CTASection />
        <StatsSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <OfflineIndicator onStatusChange={handleOnlineStatus} />
    </div>
  )
}
