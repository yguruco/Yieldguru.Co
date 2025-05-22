"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Twitter } from "lucide-react"

export default function FoundersSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
      className="relative py-12 bg-gray-50 z-10 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute left-0 top-40 h-64 w-64 rounded-full bg-[#4f1964]/5 blur-3xl"></div>
      <div className="absolute right-0 top-80 h-64 w-64 rounded-full bg-[#fbdc3e]/5 blur-3xl"></div>

      <motion.div
        style={{ y, opacity, scale }}
        className="container mx-auto max-w-6xl px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-3xl text-center"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl text-[#4f1964]">Meet Our Founders</h2>
          <p className="text-base text-gray-600">
            The visionaries behind YieldGuru who are revolutionizing EV investments in Africa.
          </p>
        </motion.div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex justify-center flex-wrap md:flex-nowrap gap-4 pb-4"
          >
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33%-0.75rem)]"
              >
                <FounderCard {...founder} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

interface FounderCardProps {
  name: string
  title: string
  imageSrc: string
  linkedin?: string
  twitter?: string
}

function FounderCard({ name, title, imageSrc, linkedin, twitter }: FounderCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md bg-white border-none">
      <CardContent className="p-0">
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="p-3">
          <h3 className="text-base font-bold text-[#4f1964]">{name}</h3>
          <p className="mb-1 text-[#fbdc3e] font-medium text-xs">{title}</p>

          <div className="flex space-x-2">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[#4f1964] hover:bg-[#4f1964] hover:text-white transition-all duration-300"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[#4f1964] hover:bg-[#4f1964] hover:text-white transition-all duration-300"
              >
                <Twitter className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const founders = [
  {
    name: "Eliud ",
    title: "CEO & Founder",
    imageSrc: "/images/eliud.jpeg",
    linkedin: "https://www.linkedin.com/in/mndeto/",
    twitter: "https://x.com/elmoonguy"
  },
  {
    name: "Martin",
    title: "CTO",
    imageSrc: "/images/martin.jpeg",
    linkedin: "https://www.linkedin.com/in/mndeto/",
    twitter: "https://x.com/0xNdeto"
  },
  {
    name: "Joshua",
    title: "CFO",
    imageSrc: "/images/joshua.jpeg",
    linkedin: "https://www.linkedin.com/in/joshua-mutuku/",
    twitter: "https://x.com/yield_guru"
  },
  {
    name: "Dennis",
    title: "E-Mobility Expert",
    imageSrc: "/images/dennis.jpeg",
    linkedin: "https://www.linkedin.com/in/dennis-wakaba-a4083043/",
    twitter: "https://x.com/plannerwakaba"
  }
]
