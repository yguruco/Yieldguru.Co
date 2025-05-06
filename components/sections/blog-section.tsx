import Link from "next/link"
import { ChevronRight } from "lucide-react"
import BlogCard from "@/components/blog-card"

export default function BlogSection() {
  return (
    <section className="bg-white py-20" id="blog">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Latest Insights</h2>
          <Link href="/blog" className="flex items-center text-[#4f1964] hover:underline">
            View all articles
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <BlogCard key={index} {...post} />
          ))}
        </div>
      </div>
    </section>
  )
}

const blogPosts = [
  {
    title: "The Future of EV Fleet Tokenization",
    excerpt:
      "How fractional ownership is redesigning commercial EV fleet financing and creating new investment opportunities.",
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
    title: "Regulatory Landscape for Tokenized EV Assets",
    excerpt:
      "A comprehensive guide to navigating the evolving regulatory environment for blockchain-based vehicle investments.",
    imageSrc: "/images/ford.jpeg",
    date: "April 10, 2023",
    readTime: "10 min read",
    category: "Compliance",
    slug: "/blog/regulatory-landscape",
  },
]
