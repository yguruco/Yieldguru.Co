"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const assetData = [
  { name: "Cars", value: 45 },
  { name: "Buses", value: 25 },
  { name: "Trucks", value: 20 },
  { name: "Scooters", value: 10 },
]

const tokenizationData = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 150 },
  { month: "Mar", value: 180 },
  { month: "Apr", value: 220 },
  { month: "May", value: 300 },
  { month: "Jun", value: 350 },
]

const COLORS = ["#4f1964", "#fbdc3e", "#f68b27", "#6b21a8"]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Assets" value="1,245" description="+12% from last month" delay={0} />
        <StatCard title="Active Investors" value="867" description="+5% from last month" delay={0.1} />
        <StatCard title="Total Value Locked" value="$24.5M" description="+18% from last month" delay={0.2} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Asset Distribution</CardTitle>
              <CardDescription>Breakdown of tokenized EV assets by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {assetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tokenization Growth</CardTitle>
              <CardDescription>Monthly tokenization volume in thousands</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tokenizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4f1964" />
                  </BarChart>
                </ResponsiveContainer>
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
