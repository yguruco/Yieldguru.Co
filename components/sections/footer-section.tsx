"use client"

import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="relative bg-[#4f1964] py-16 text-white mt-0 mb-0 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="border-t border-white/10 pt-6">
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

