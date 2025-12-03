"use client"

import { useState, useEffect } from "react"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="home" className="relative w-full px-2 sm:px-4 py-12 sm:py-20 lg:py-40 overflow-hidden">
      {/* Background animated blobs */}
      <div
        className="absolute top-20 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"
        style={{
          animation: "float 7s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-20 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"
        style={{
          animation: "float 9s ease-in-out infinite reverse",
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
      `}</style>

      <div className="mx-auto max-w-4xl relative z-10">
        <div
          className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Subtitle */}
          <p className="mb-3 sm:mb-6 text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary animate-pulse">
            Welcome to AppFlow
          </p>

          <h1 className="mb-4 sm:mb-8 text-2xl sm:text-4xl lg:text-7xl font-bold tracking-tight text-foreground text-balance leading-tight">
            The Progressive Web Experience You Deserve
          </h1>

          <p className="mb-6 sm:mb-12 text-sm sm:text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed px-0 sm:px-2">
            Fast, reliable, and installable. AppFlow brings native app experience to the web with offline capabilities
            and lightning-fast performance.
          </p>

          <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row justify-center items-center px-0">
            <button className="w-full sm:w-auto rounded-full bg-gradient-to-r from-primary to-accent px-6 sm:px-10 py-2 sm:py-4 text-sm sm:text-base font-semibold text-primary-foreground shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95">
              Get Started
            </button>
            <button className="w-full sm:w-auto rounded-full border-2 border-primary px-6 sm:px-10 py-2 sm:py-4 text-sm sm:text-base font-semibold text-primary hover:bg-primary/10 transition-all duration-300 active:scale-95">
              Learn More
            </button>
          </div>

          <div
            className="mt-12 sm:mt-20 flex justify-center"
            style={{
              animation: "float 5s ease-in-out infinite",
            }}
          >
            <div className="h-24 w-24 sm:h-40 sm:w-40 rounded-3xl bg-gradient-to-b from-primary/30 to-accent/30 blur-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
