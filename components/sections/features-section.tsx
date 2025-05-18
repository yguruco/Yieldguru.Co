"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import { Lightbulb, LineChart, Shield, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

export default function FeaturesSection() {
  // Add scroll animation
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const visibleFeatures = 1 // Display only one feature at a time
  const totalFeatures = features.length
  const maxIndex = totalFeatures - 1 // Each feature gets its own slide

  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
      }, 5000)
    }

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current)
      }
    }
  }, [autoplay, currentIndex, maxIndex])

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1))
  }

  // We're now displaying one feature at a time, so we don't need this function anymore

  return (
    <section ref={sectionRef} className="bg-gray-50 py-24" id="solutions">
      <div className="container mx-auto max-w-6xl px-8 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose YieldGuru for EV Loan Investments
          </h2>
          <p className="text-lg text-gray-600">
            Our platform combines cutting-edge blockchain technology with deep EV industry expertise.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="relative">
          {/* Carousel navigation */}
          <div className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 md:-left-8">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-100"
              aria-label="Previous features"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 md:-right-8">
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-100"
              aria-label="Next features"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Feature card - one at a time */}
          <div className="overflow-hidden px-4 py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  onMouseEnter={() => setAutoplay(false)}
                  onMouseLeave={() => setAutoplay(true)}
                  className="w-full max-w-xl px-4"
                >
                  <FeatureCard {...features[currentIndex]} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel indicators */}
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-8 rounded-full transition-all ${
                  currentIndex === index ? "bg-[#4f1964]" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ElementType
}

function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="h-full rounded-xl bg-white p-2 shadow-[10px_10px_20px_#d9d9d9,-10px_-10px_20px_#ffffff] transition-all duration-300 hover:shadow-[15px_15px_25px_#d1d1d1,-15px_-15px_25px_#ffffff]">
      <div className="rounded-lg bg-white p-10 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#4f1964]/10 shadow-[inset_5px_5px_10px_rgba(0,0,0,0.05),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]">
          <Icon className="h-12 w-12 text-[#4f1964]" />
        </div>
        <h3 className="mb-4 text-2xl font-bold">{title}</h3>
        <p className="mx-auto max-w-md text-lg text-gray-600">{description}</p>
      </div>
    </div>
  )
}

const features = [
  {
    title: "Secure Tokenization",
    description: "Military-grade security protocols protect your digital assets and transaction data.",
    icon: Shield,
  },
  {
    title: "Transparent Tracking",
    description: "Real-time performance metrics and complete visibility into asset utilization.",
    icon: LineChart,
  },
  {
    title: "Fractional Ownership",
    description: "Invest in portions of high-value EV assets with minimal capital requirements.",
    icon: Users,
  },
  {
    title: "Sustainable Returns",
    description: "Generate consistent yields while supporting clean transportation solutions.",
    icon: Lightbulb,
  },
  {
    title: "Automated Compliance",
    description: "Built-in regulatory frameworks ensure all transactions meet legal requirements.",
    icon: Shield,
  },
  {
    title: "Liquidity Options",
    description: "Secondary market access for trading tokenized EV loans with ease.",
    icon: LineChart,
  },
]