"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    content: "AppFlow transformed how we deliver our product. The offline functionality is a game-changer.",
    avatar: "👩‍💼",
    rating: 5,
  },
  {
    name: "Alex Chen",
    role: "Lead Developer",
    content: "Finally, a PWA solution that actually works. The performance improvements are incredible.",
    avatar: "👨‍💻",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Startup Founder",
    content: "We saved months of development time. AppFlow is production-ready from day one.",
    avatar: "👩‍🔬",
    rating: 5,
  },
]

export default function TestimonialsSection() {
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="w-full px-2 sm:px-4 py-12 sm:py-24 md:py-32 relative">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-16 text-center text-2xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance"
        >
          Loved by Developers
        </motion.h2>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -12,
                boxShadow: "0 25px 50px rgba(85, 163, 255, 0.1)",
              }}
              className="group rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-4 sm:p-8 backdrop-blur hover:border-primary/50 transition-all"
            >
              {/* Stars */}
              <motion.div
                className="mb-3 sm:mb-4 flex gap-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                className="mb-4 sm:mb-6 text-xs sm:text-base text-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                "{testimonial.content}"
              </motion.p>

              <motion.div
                className="flex items-center gap-2 sm:gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="text-xl sm:text-3xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <p className="text-xs sm:text-base font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
