"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect } from "react"

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Transform values for parallax effect
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, -40])

  // Add a class to the body to help with fixed positioning
  useEffect(() => {
    // Add a class to help with fixed positioning
    document.body.classList.add('has-parallax-sections')

    return () => {
      document.body.classList.remove('has-parallax-sections')
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-white py-24 pb-48" id="blog">
      {/* Decorative elements */}
      <div className="absolute -left-16 top-40 h-64 w-64 rounded-full bg-[#4f1964]/5 blur-3xl"></div>
      <div className="absolute -right-16 top-80 h-64 w-64 rounded-full bg-[#fbdc3e]/5 blur-3xl"></div>

      {/* Fixed background effect for parallax */}
      <div className="absolute inset-0 bg-white -z-10"></div>

      {/* This div helps with the fixed position effect */}
      <div className="fixed inset-0 -z-20 bg-white opacity-0 pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl px-8 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest Insights
          </h2>
          <p className="text-lg text-gray-600">
            Stay updated with the latest trends and developments in EV tokenization.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity, scale, y }}
          className="relative"
        >
          <div className="flex justify-end mb-8">
            <Link href="/blog" className="flex items-center text-[#4f1964] hover:underline">
              View all articles
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Featured post - larger card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="col-span-12 md:col-span-8"
            >
              <BentoBlogCard
                {...blogPosts[0]}
                featured={true}
              />
            </motion.div>

            {/* Secondary posts - vertical cards */}
            <div className="col-span-12 md:col-span-4 grid gap-6">
              {blogPosts.slice(1, 3).map((post, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <BentoBlogCard {...post} compact={true} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface BentoBlogCardProps {
  title: string
  excerpt: string
  imageSrc: string
  date: string
  readTime: string
  category: string
  slug: string
  featured?: boolean
  compact?: boolean
}

function BentoBlogCard({
  title,
  excerpt,
  imageSrc,
  date,
  readTime,
  category,
  slug,
  featured = false,
  compact = false
}: BentoBlogCardProps) {
  return (
    <Link href={slug}>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg group">
        <div className={`grid ${featured ? 'md:grid-cols-2' : compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} h-full`}>
          <div className={`relative w-full h-full min-h-[200px]`}>
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <Badge className="absolute right-3 top-3 bg-[#4f1964]">{category}</Badge>
          </div>
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
                <span>{date}</span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {readTime}
                </span>
              </div>
              <h3 className={`mb-2 ${featured ? 'text-2xl' : 'text-xl'} font-bold`}>{title}</h3>
              {!compact && <p className="text-gray-600">{excerpt}</p>}
            </div>
            {featured && (
              <div className="mt-4">
                <span className="text-[#4f1964] font-medium group-hover:underline">Read more</span>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}

const blogPosts = [
  {
    title: "The Future of Tokenized EV Loans",
    excerpt:
      "How investing in tokenized EV loans is redesigning commercial EV financing and creating new investment opportunities.",
    imageSrc: "/images/ford-vehicle.jpeg",
    date: "May 15, 2023",
    readTime: "8 min read",
    category: "Investment",
    slug: "/blog/ev-fleet-tokenization",
  },
  {
    title: "Maximizing Returns on Electric Bus Investments",
    excerpt: "Analysis of yield patterns across public transportation EV assets and strategies for optimizing returns.",
    imageSrc: "/images/electric-bus.jpeg",
    date: "April 28, 2023",
    readTime: "6 min read",
    category: "Strategy",
    slug: "/blog/electric-bus-investments",
  },
  {
    title: "Regulatory Landscape for Tokenized EV Loans",
    excerpt:
      "A comprehensive guide to navigating the evolving regulatory environment for blockchain-based EV loan investments.",
    imageSrc: "/images/ford.jpeg",
    date: "April 10, 2023",
    readTime: "10 min read",
    category: "Compliance",
    slug: "/blog/regulatory-landscape",
  },
]
