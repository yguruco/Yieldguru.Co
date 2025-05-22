"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { LineChart, Shield, Truck, Users, BarChart3, Zap, Settings, Wallet, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, useScroll, useTransform } from "framer-motion"

export default function DashboardSection() {
  // Add scroll animation for elements
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  return (
    <section ref={sectionRef} className="relative bg-white py-2 pb-0" id="features">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-white/50 to-transparent"></div>
      <div className="absolute -left-16 top-40 h-64 w-64 rounded-full bg-[#4f1964]/5 blur-3xl"></div>
      <div className="absolute -right-16 top-80 h-64 w-64 rounded-full bg-[#fbdc3e]/5 blur-3xl"></div>

      <div className="container mx-auto max-w-6xl px-8 pb-0 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Two Powerful Dashboards for Complete <br/>
            <span className="relative inline-block h-[40px] overflow-hidden sm:h-[50px]">
              <span className="animate-scroll-text absolute left-0 flex flex-col">
                <span className="text-[#4f1964]">EV Asset Management</span>
                <span className="text-[#fbdc3e]">Investment Tracking</span>
                <span className="text-[#f68b27]">Fleet Optimization</span>
                <span className="text-[#4f1964]">EV Asset Management</span>
              </span>
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            YieldGuru provides specialized interfaces for every stakeholder in the EV tokenization ecosystem.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-3">
          {/* Operator Dashboard - Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-2"
          >
            <DashboardCard
              title="EV-Operator Dashboard"
              description="Monitor vehicle performance, optimize operations, and maximize the value of your EV fleet."
              icon={Truck}
              color="#f68b27"
              size="medium"
              features={[
                { icon: Zap, text: "Fleet Monitoring" },
                { icon: BarChart3, text: "Efficiency Analytics" }
              ]}
            />
          </motion.div>

          {/* Investor Dashboard - Medium Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-1"
          >
            <DashboardCard
              title="Investor Dashboard"
              description="Track investments, explore new opportunities, and manage your diversified EV asset portfolio."
              icon={LineChart}
              color="#fbdc3e"
              size="medium"
              features={[
                { icon: Wallet, text: "Portfolio Management" },
                { icon: BarChart3, text: "Return Tracking" }
              ]}
            />
          </motion.div>

          {/* Small Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="md:col-span-1 md:row-span-1"
          >
            <FeatureCard
              icon={Zap}
              title="Real-time Updates"
              color="#4f1964"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="md:col-span-1 md:row-span-1"
          >
            <FeatureCard
              icon={Clock}
              title="Historical Data"
              color="#fbdc3e"
            />
          </motion.div>
        </motion.div>
      </div>
      {/* Simple section divider */}
      <div className="relative mt-0 flex justify-center">
        <div className="relative h-1 w-full max-w-3xl">
          {/* Center line */}
          <div className="absolute left-1/2 top-1/2 h-[1px] w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

          {/* Brand color dots */}
          <div className="floating-dot-1 absolute left-1/4 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#4f1964] opacity-70"></div>
          <div className="floating-dot-2 absolute left-1/2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#fbdc3e] opacity-70"></div>
          <div className="floating-dot-3 absolute left-3/4 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#f68b27] opacity-70"></div>
        </div>
      </div>
    </section>
  )
}

interface DashboardCardProps {
  title: string
  description: string
  icon: React.ElementType
  color: string
  size?: "medium" | "large"
  features?: Array<{ icon: React.ElementType, text: string }>
}

function DashboardCard({ title, description, icon: Icon, color, size = "medium", features }: DashboardCardProps) {
  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className={`flex h-full flex-col p-2 ${size === "large" ? "pb-2" : ""}`}>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-500 group-hover:rotate-12" style={{ backgroundColor: color }}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className={`${size === "large" ? "mb-3" : "mb-2"} flex-1 text-gray-600`}>{description}</p>

        {features && features.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
              >
                <feature.icon className="h-4 w-4" style={{ color }} />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  color: string
}

function FeatureCard({ icon: Icon, title, color }: FeatureCardProps) {
  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex h-full flex-col items-center justify-center p-2 text-center">
        <div
          className="mb-1 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" style={{ color }} />
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </CardContent>
    </Card>
  )
}
"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { LineChart, Shield, Truck, Users, BarChart3, Zap, Settings, Wallet, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, useScroll, useTransform } from "framer-motion"

export default function DashboardSection() {
  // Add scroll animation for elements
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  return (
    <section ref={sectionRef} className="relative bg-white py-2 pb-0" id="features">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-white/50 to-transparent"></div>
      <div className="absolute -left-16 top-40 h-64 w-64 rounded-full bg-[#4f1964]/5 blur-3xl"></div>
      <div className="absolute -right-16 top-80 h-64 w-64 rounded-full bg-[#fbdc3e]/5 blur-3xl"></div>

      <div className="container mx-auto max-w-6xl px-8 pb-0 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Two Powerful Dashboards for complete EV Asset Management <br/>
            <span className="relative inline-block h-[40px] overflow-hidden sm:h-[50px]">
              <span className="animate-scroll-text absolute left-0 flex flex-col">
                <span className="text-[#4f1964]">EV Asset Management</span>
                <span className="text-[#fbdc3e]">Investment Tracking</span>
                <span className="text-[#f68b27]">Fleet Optimization</span>
                <span className="text-[#4f1964]">EV Asset Management</span>
              </span>
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            YieldGuru provides specialized interfaces for every stakeholder in the EV tokenization ecosystem.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-3">
          {/* Operator Dashboard - Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-2"
          >
            <DashboardCard
              title="EV-Operator Dashboard"
              description="Monitor vehicle performance, optimize operations, and maximize the value of your EV fleet."
              icon={Truck}
              color="#f68b27"
              size="medium"
              features={[
                { icon: Zap, text: "Fleet Monitoring" },
                { icon: BarChart3, text: "Efficiency Analytics" }
              ]}
            />
          </motion.div>

          {/* Investor Dashboard - Medium Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-1"
          >
            <DashboardCard
              title="Investor Dashboard"
              description="Track investments, explore new opportunities, and manage your diversified EV asset portfolio."
              icon={LineChart}
              color="#fbdc3e"
              size="medium"
              features={[
                { icon: Wallet, text: "Portfolio Management" },
                { icon: BarChart3, text: "Return Tracking" }
              ]}
            />
          </motion.div>

          {/* Small Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="md:col-span-1 md:row-span-1"
          >
            <FeatureCard
              icon={Zap}
              title="Real-time Updates"
              color="#4f1964"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="md:col-span-1 md:row-span-1"
          >
            <FeatureCard
              icon={Clock}
              title="Historical Data"
              color="#fbdc3e"
            />
          </motion.div>
        </motion.div>
      </div>
      {/* Simple section divider */}
      <div className="relative mt-0 flex justify-center">
        <div className="relative h-1 w-full max-w-3xl">
          {/* Center line */}
          <div className="absolute left-1/2 top-1/2 h-[1px] w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

          {/* Brand color dots */}
          <div className="floating-dot-1 absolute left-1/4 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#4f1964] opacity-70"></div>
          <div className="floating-dot-2 absolute left-1/2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#fbdc3e] opacity-70"></div>
          <div className="floating-dot-3 absolute left-3/4 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#f68b27] opacity-70"></div>
        </div>
      </div>
    </section>
  )
}

interface DashboardCardProps {
  title: string
  description: string
  icon: React.ElementType
  color: string
  size?: "medium" | "large"
  features?: Array<{ icon: React.ElementType, text: string }>
}

function DashboardCard({ title, description, icon: Icon, color, size = "medium", features }: DashboardCardProps) {
  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className={`flex h-full flex-col p-2 ${size === "large" ? "pb-2" : ""}`}>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-500 group-hover:rotate-12" style={{ backgroundColor: color }}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className={`${size === "large" ? "mb-3" : "mb-2"} flex-1 text-gray-600`}>{description}</p>

        {features && features.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
              >
                <feature.icon className="h-4 w-4" style={{ color }} />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  color: string
}

function FeatureCard({ icon: Icon, title, color }: FeatureCardProps) {
  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex h-full flex-col items-center justify-center p-2 text-center">
        <div
          className="mb-1 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" style={{ color }} />
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </CardContent>
    </Card>
  )
}