"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const stats = [
  { value: 100, label: "K+ Downloads", suffix: "K+" },
  { value: 98, label: "Performance Score", suffix: "%" },
  { value: 50, label: "Countries", suffix: "+" },
  { value: 99, label: "Uptime", suffix: "." },
]

function CounterAnimation({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })

  useEffect(() => {
    if (!inView) return

    let current = 0
    const increment = value / 60
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 20)

    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <div ref={ref}>
      <motion.div
        className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {count}
        {suffix}
      </motion.div>
    </div>
  )
}

export default function StatsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="w-full px-2 sm:px-4 py-12 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(85, 163, 255, 0.15)",
              }}
              className="group rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-4 sm:p-8 text-center backdrop-blur hover:border-primary/50 transition-all"
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <CounterAnimation value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </p>
              <motion.div
                className="mt-3 sm:mt-4 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                style={{ originX: 0 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
