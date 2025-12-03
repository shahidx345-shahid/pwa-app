"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight, Zap } from "lucide-react"

export default function CTASection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <section ref={ref} className="w-full px-2 sm:px-4 py-16 sm:py-32 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10 opacity-40"
        animate={{
          background: [
            "radial-gradient(circle at 30% 70%, rgba(85, 163, 255, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 30%, rgba(85, 163, 255, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl sm:rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-6 sm:p-16 text-center backdrop-blur"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-5xl font-bold text-foreground text-balance">
              Ready to Build Something Amazing?
            </h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-lg text-muted-foreground text-balance">
              Join thousands of developers building fast, reliable Progressive Web Apps with modern web technologies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(85, 163, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-2 sm:py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Get Started Now</span>
              <span className="sm:hidden">Get Started</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(85, 163, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-2 sm:py-4 rounded-xl border-2 border-primary text-primary text-sm sm:text-base font-semibold hover:bg-primary/5 transition-all"
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="hidden sm:inline">No credit card required</span>
              <span className="sm:hidden">Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="hidden sm:inline">Free forever plan</span>
              <span className="sm:hidden">Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="hidden sm:inline">Deploy in minutes</span>
              <span className="sm:hidden">Fast</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
