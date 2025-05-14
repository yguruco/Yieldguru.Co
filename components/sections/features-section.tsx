import type React from "react"
import { Lightbulb, LineChart, Shield, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-20" id="solutions">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose YieldGuru for EV Loan Investments
          </h2>
          <p className="text-lg text-gray-600">
            Our platform combines cutting-edge blockchain technology with deep EV industry expertise.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
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
