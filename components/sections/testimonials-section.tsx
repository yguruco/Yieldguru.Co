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

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#4f1964] py-12 pb-16 text-white z-10 -mt-32 overflow-hidden w-full"
      style={{
        position: "relative",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden"
      }}
    >
      {/* Decorative elements */}
      <div className="absolute left-0 top-40 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute right-0 top-80 h-64 w-64 rounded-full bg-[#fbdc3e]/5 blur-3xl"></div>

      <motion.div
        style={{ y, opacity, scale }}
        className="container mx-auto max-w-5xl px-4 pt-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">Trusted by Industry Leaders</h2>
          <p className="text-base text-white/80">
            Hear from our partners who are transforming the EV investment landscape.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                boxShadow: "20px 20px 60px rgba(0, 0, 0, 0.2), -20px -20px 60px rgba(255, 255, 255, 0.1)"
              }}
              className="aspect-square"
            >
              <TestimonialCard
                {...testimonial}
                originalIndex={index}
                glassmorphic={true}
                compact={false}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

const testimonials = [
  {
    quote:
      "With YieldGuru we have been able to enter into a financing partnership to increase our electric vans fleet from 2 to 50 vans plying the Ruiru - Ruaka - Westlands routes, and more routes are opening up",
    author: "Sam Kamau",
    title: "CEO - Sony Classic Shuttles",
  },
  {
    quote:
      "This new investing platform is creating a massive opportunity to drive professionalism in the matatu industry, and our workers now have an easy transparent way they can actually easily own the matatus they operate on the road",
    author: "Nyambura Githiga",
    title: "Federation of Drivers and Conductors Kenya (FEDCO)",
  },
  {
    quote:
      "We are working with YieldGuru to launch the first National EV Buses Sacco in Kenya. We will enable our members transition 100% to electric buses, with cheaper financing alternatives",
    author: "Bernard Odero",
    title: "Chairman - National Electric Mobility SACCO",
  }
]