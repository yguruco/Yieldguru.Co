"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/electric-bus.jpeg"
          alt="Electric vehicle on the road"
          fill
          className="object-cover object-center brightness-[0.7]"
          priority
        />
        {/* Gradient at the bottom of the hero section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto max-w-2xl px-4 text-center font-inter"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl"
        >
          Invest in <span className="relative inline-block h-[60px] overflow-hidden align-bottom sm:h-[72px]">
            <span className="animate-scroll-text absolute left-0 flex flex-col">
              <span className="text-yellow-300">E-Mobility</span>
              <span className="text-yellow-300">Clean Energy</span>
              <span className="text-yellow-300">The Future</span>
              <span className="text-yellow-300">Sustainability</span>
              <span className="text-yellow-300">E-Mobility</span>
            </span>
          </span> with <span className="text-yellow-300">Simplicity</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 text-xl text-white/90"
        >
          Yield Guru Investments is pioneering a crowd investing platform into E-mobility assets with quarterly yields. Get fractional ownership in public transport E-Buses, taxi EVs, and our network of charging stations.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button size="lg" className="bg-yellow-300 text-purple-900 hover:bg-yellow-300/90">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10">
            Learn More
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}