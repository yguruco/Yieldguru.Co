"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const portfolioData = [
  { month: "Jan", value: 10000 },
  { month: "Feb", value: 12000 },
  { month: "Mar", value: 11500 },
  { month: "Apr", value: 13500 },
  { month: "May", value: 14800 },
  { month: "Jun", value: 16200 },
]

const yieldData = [
  { month: "Jan", value: 4.2 },
  { month: "Feb", value: 4.3 },
  { month: "Mar", value: 4.1 },
  { month: "Apr", value: 4.5 },
  { month: "May", value: 4.7 },
  { month: "Jun", value: 4.9 },
]

export default function InvestorDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Portfolio Value" value="$16,200" description="+9.5% from last month" delay={0} />
        <StatCard title="Current Yield" value="4.9%" description="+0.2% from last month" delay={0.1} />
        <StatCard title="Total Assets" value="12" description="+2 from last month" delay={0.2} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Your investment growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
                  <Area type="monotone" dataKey="value" stroke="#fbdc3e" fill="#fbdc3e" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Yield Trends</CardTitle>
              <CardDescription>Monthly yield percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Yield"]} />
                    <Line type="monotone" dataKey="value" stroke="#f68b27" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Investment Opportunities</CardTitle>
              <CardDescription>New tokenized assets available for investment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <OpportunityCard title="Electric Bus Fleet" yield="5.2%" minInvestment="$1,000" available="$245,000" />
                <OpportunityCard title="Taxi EV Network" yield="4.8%" minInvestment="$500" available="$120,000" />
                <OpportunityCard title="Delivery Vans" yield="5.5%" minInvestment="$2,000" available="$380,000" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  description: string
  delay: number
}

function StatCard({ title, value, description, delay }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface OpportunityCardProps {
  title: string
  yield: string
  minInvestment: string
  available: string
}

function OpportunityCard({ title, yield: yieldValue, minInvestment, available }: OpportunityCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <h3 className="font-medium">{title}</h3>
        <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
          <span>Yield: {yieldValue}</span>
          <span>Min: {minInvestment}</span>
          <span>Available: {available}</span>
        </div>
      </div>
      <Button style={{ backgroundColor: "#fbdc3e", color: "#4f1964" }}>Invest</Button>
    </div>
  )
}
