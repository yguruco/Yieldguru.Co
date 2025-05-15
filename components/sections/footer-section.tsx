"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="relative bg-[#4f1964] py-16 text-white -mt-24 mb-0">
      {/* Decorative elements */}
      <div className="absolute -left-16 top-40 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute -right-16 top-80 h-64 w-64 rounded-full bg-[#fbdc3e]/5 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 flex items-center">
              <div className="relative mr-3 h-10 w-10 overflow-hidden">
                <Image
                  src="/images/YG LOGO.png"
                  alt="YieldGuru Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold">YieldGuru</span>
            </div>
            <p className="mb-6 text-gray-300 leading-relaxed">
              Revolutionizing EV asset tokenization with secure, transparent, and efficient investment opportunities.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" label="Twitter" icon="twitter" />
              <SocialLink href="#" label="LinkedIn" icon="linkedin" />
              <SocialLink href="#" label="Facebook" icon="facebook" />
              <SocialLink href="#" label="Instagram" icon="instagram" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-xl font-semibold text-[#fbdc3e]">Platform</h3>
            <ul className="space-y-3">
              {[
                { label: "Admin Dashboard", href: "#" },
                { label: "Investor Dashboard", href: "#" },
                { label: "EV-Operator Dashboard", href: "#" },
                { label: "Asset Marketplace", href: "#" },
                { label: "Token Analytics", href: "#" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#fbdc3e] transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-2 text-[#fbdc3e] opacity-0 group-hover:opacity-100 transition-opacity">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-xl font-semibold text-[#fbdc3e]">Resources</h3>
            <ul className="space-y-3">
              {[
                { label: "Documentation", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Case Studies", href: "#" },
                { label: "FAQ", href: "#faq" },
                { label: "API Reference", href: "#" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#fbdc3e] transition-colors duration-200 flex items-center group"
                  >
                    <span className="mr-2 text-[#fbdc3e] opacity-0 group-hover:opacity-100 transition-opacity">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-xl font-semibold text-[#fbdc3e]">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-[#fbdc3e] mt-0.5" />
                <span className="text-gray-300">123 Innovation Drive, San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-[#fbdc3e]" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-[#fbdc3e]" />
                <span className="text-gray-300">info@yieldguru.co</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} YieldGuru. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm text-gray-300 hover:text-[#fbdc3e] transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-300 hover:text-[#fbdc3e] transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-300 hover:text-[#fbdc3e] transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

interface SocialLinkProps {
  href: string
  label: string
  icon: "twitter" | "linkedin" | "facebook" | "instagram"
}

function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#fbdc3e] hover:text-[#4f1964] transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="sr-only">{label}</span>
      {icon === "twitter" ? (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ) : icon === "linkedin" ? (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ) : icon === "facebook" ? (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
          <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
          <circle cx="18.406" cy="5.594" r="1.44" />
        </svg>
      )}
    </motion.a>
  )
}
