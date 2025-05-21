import type React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import NewsletterSignup from "@/components/newsletter-signup"
import Navbar from "@/components/layout/navbar"
import HeroSection from "@/components/sections/hero-section"
import DashboardSection from "@/components/sections/dashboard-section"
import FeaturesSection from "@/components/sections/features-section"
import AssetShowcaseSection from "@/components/sections/asset-showcase-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import FAQSection from "@/components/sections/faq-section"
import CTASection from "@/components/sections/cta-section"
import BlogSection from "@/components/sections/blog-section"
import FooterSection from "@/components/sections/footer-section"
import FoundersSection from "@/components/sections/founders-section"
import ContactSection from "@/components/sections/contact-section"
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <HeroSection />
      <DashboardSection />

      <FeaturesSection />
      {/* <CTASection /> */}

      {/* Newsletter Section */}
      {/* <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <NewsletterSignup />
          </div>
        </div>
      </section> */}

      <BlogSection />
      <TestimonialsSection />
      <FoundersSection />
      <FAQSection />
      <ContactSection />
      <FooterSection />
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ElementType
}

function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#4f1964]/10">
          <Icon className="h-5 w-5 text-[#4f1964]" />
        </div>
        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

interface AssetCardProps {
  title: string
  description: string
  imageSrc: string
}

function AssetCard({ title, description, imageSrc }: AssetCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-6">
        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}