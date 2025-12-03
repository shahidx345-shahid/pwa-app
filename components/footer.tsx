"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ]

  const footerLinks = [
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
  ]

  return (
    <footer className="w-full border-t border-border/40 bg-gradient-to-b from-card/50 to-background px-2 sm:px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 sm:gap-12 md:grid-cols-4 mb-8 sm:mb-12"
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <motion.div className="flex items-center gap-2 mb-3 sm:mb-4" whileHover={{ scale: 1.05 }}>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-xs sm:text-sm shadow-lg"
              >
                AF
              </motion.div>
              <span className="font-bold text-sm sm:text-base">AppFlow</span>
            </motion.div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The progressive web app platform for the future.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <motion.li key={link.label} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Follow</h4>
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{
                    scale: 1.15,
                    y: -4,
                    boxShadow: "0 10px 25px rgba(85, 163, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-gradient-to-br hover:from-primary/20 hover:to-accent/20 transition-all"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Updates</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">Get notified about new features</p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(85, 163, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-lg bg-gradient-to-r from-primary to-accent px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground transition-all"
            >
              Subscribe
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          variants={itemVariants}
          className="border-t border-border/40 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground"
        >
          <p>&copy; {currentYear} AppFlow. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
