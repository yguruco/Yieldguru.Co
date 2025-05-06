import type React from "react"
import { LineChart, Shield, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardSection() {
  return (
    <section className="bg-white py-20" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Three Powerful Dashboards for Complete EV Asset Management
          </h2>
          <p className="text-lg text-gray-600">
            YieldGuru provides specialized interfaces for every stakeholder in the EV tokenization ecosystem.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <DashboardCard
            title="Admin Dashboard"
            description="Comprehensive platform management with asset oversight, user administration, and performance analytics."
            icon={Shield}
            color="#4f1964"
          />
          <DashboardCard
            title="Investor Dashboard"
            description="Track investments, explore new opportunities, and manage your diversified EV asset portfolio."
            icon={LineChart}
            color="#fbdc3e"
          />
          <DashboardCard
            title="EV-Operator Dashboard"
            description="Monitor vehicle performance, optimize operations, and maximize the value of your EV fleet."
            icon={Truck}
            color="#f68b27"
          />
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
}

function DashboardCard({ title, description, icon: Icon, color }: DashboardCardProps) {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style={{ backgroundColor: color }}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="mb-4 flex-1 text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}
