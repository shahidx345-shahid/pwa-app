"use client"

import { useEffect, useState } from "react"
import { Zap, Shield, Smartphone, Cloud, Layers, Gauge } from "lucide-react"
import { useInView } from "react-intersection-observer"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-second load times with intelligent caching and service worker optimization.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "HTTPS-only delivery with CSP and automatic security updates built in.",
  },
  {
    icon: Smartphone,
    title: "Install Anywhere",
    description: "Add to homescreen on any device. One click to install, just like native apps.",
  },
  {
    icon: Cloud,
    title: "Works Offline",
    description: "Full offline functionality. Your app works even without internet connection.",
  },
  {
    icon: Layers,
    title: "Progressive Enhancement",
    description: "Works on all browsers with graceful degradation and enhanced features.",
  },
  {
    icon: Gauge,
    title: "High Performance",
    description: "Optimized for 3G networks and low-end devices. Blazing fast everywhere.",
  },
]

export default function FeaturesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [cardStates, setCardStates] = useState(features.map(() => false))

  useEffect(() => {
    if (inView) {
      features.forEach((_, index) => {
        setTimeout(() => {
          setCardStates((prev) => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }, index * 120)
      })
    }
  }, [inView])

  return (
    <section id="features" ref={ref} className="w-full px-2 sm:px-4 py-16 sm:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle at 20% 50%, rgba(85, 163, 255, 0.1) 0%, transparent 50%)",
          animation: "shift 15s linear infinite",
        }}
      />

      <style>{`
        @keyframes shift {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div
          className={`mb-8 sm:mb-16 text-center transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="mb-2 sm:mb-4 text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Powerful Features Built In
          </h2>
          <p className="text-xs sm:text-lg text-muted-foreground text-balance px-2">
            Everything you need to build fast, reliable web applications
          </p>
        </div>

        <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group rounded-2xl border border-border/50 bg-card/50 p-4 sm:p-8 backdrop-blur transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 cursor-pointer ${
                  cardStates[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="mb-3 sm:mb-6 inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-2 sm:p-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                  <Icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-base sm:text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                <div className="mt-3 sm:mt-4 h-1 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
