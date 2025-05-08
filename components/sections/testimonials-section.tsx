"use client"

import { useRef } from "react"
import TestimonialCard from "@/components/testimonial-card"
import { motion, useScroll, useTransform } from "framer-motion"

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1])

  // For the flowing loop
  const totalTestimonials = testimonials.length

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#4f1964] py-20 pb-32 text-white z-10 -mt-32 overflow-hidden"
      style={{
        position: "relative",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden"
      }}
    >
      {/* Decorative elements */}
      <div className="absolute -left-16 top-40 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute -right-16 top-80 h-64 w-64 rounded-full bg-[#fbdc3e]/5 blur-3xl"></div>

      {/* No curved top edge needed with the new gradient approach */}

      <motion.div
        style={{ y, opacity, scale }}
        className="container mx-auto max-w-6xl px-8 sm:px-10 lg:px-12 pt-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Industry Leaders</h2>
          <p className="text-lg text-white/80">
            Hear from our partners who are transforming the EV investment landscape.
          </p>
        </motion.div>

        <div className="relative">
          {/* Testimonial cards - flowing loop */}
          <div className="overflow-hidden px-4 py-6">
            <div className="flex">
              <motion.div
                animate={{
                  x: [0, -100 * (totalTestimonials / 2)],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear"
                }}
                className="flex gap-6"
              >
                {/* First set of testimonials */}
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={`first-${index}`}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="w-[280px] flex-shrink-0"
                  >
                    <TestimonialCard
                      {...testimonial}
                      originalIndex={index}
                      glassmorphic={true}
                      compact={true}
                    />
                  </motion.div>
                ))}

                {/* Duplicate set for seamless loop */}
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={`second-${index}`}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="w-[280px] flex-shrink-0"
                  >
                    <TestimonialCard
                      {...testimonial}
                      originalIndex={index}
                      glassmorphic={true}
                      compact={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* No indicators needed for flowing loop */}
        </div>
      </motion.div>
    </section>
  )
}

const testimonials = [
  {
    quote:
      "Getting our electric buses funded used to take months. With YieldGuru, we closed our last round in under two weeks. It's a game-changer for transit expansion.",
    author: "Sarah Johnson",
    title: "Fleet Manager at MetroTransit",
  },
  {
    quote:
      "I started small, but now YieldGuru is a core part of my portfolio. Reliable returns, clear reporting — finally, something in Web3 that just works.",
    author: "Michael Chen",
    title: "Director at Green Investment Partners",
  },
  {
    quote:
      "We've been tracking EV asset trends across Africa, and YieldGuru has one of the most actionable models for deploying capital transparently.",
    author: "Kelvin Johnsone",
    title: "Research & Strategy at Africa Insights",
  },
  {
    quote:
      "The tokenization platform has transformed how we manage our delivery fleet. Real-time data and transparent investor reporting have been game-changers.",
    author: "Emma Rodriguez",
    title: "Operations Director at EcoDelivery",
  },
  {
    quote:
      "As an institutional investor, we need robust compliance and security. YieldGuru's platform exceeds our requirements while delivering consistent returns.",
    author: "David Park",
    title: "Investment Manager at Future Mobility Fund",
  },
  {
    quote:
      "The fractional ownership model has allowed us to scale our municipal EV fleet without the traditional capital constraints. Truly innovative.",
    author: "Sophia Williams",
    title: "City Transport Coordinator",
  }
]
