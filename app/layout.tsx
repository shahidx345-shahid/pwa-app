import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ServiceWorkerRegistration from "@/components/service-worker-registration"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AppFlow - Progressive Web App",
  description: "Experience the future of web apps with offline capabilities and seamless performance",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AppFlow",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#55a3ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
