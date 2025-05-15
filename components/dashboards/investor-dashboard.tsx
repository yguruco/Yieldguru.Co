"use client"

import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, BarChart3, TrendingUp, Percent, CreditCard } from "lucide-react"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder"

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
  const accentColor = "#fbdc3e";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Portfolio Value"
            value="$16,200"
            description="+9.5% from last month"
            trend="up"
            trendValue="9.5%"
            icon={<Wallet className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Current Yield"
            value="4.9%"
            description="+0.2% from last month"
            trend="up"
            trendValue="0.2%"
            icon={<Percent className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Total Assets"
            value="12"
            description="+2 from last month"
            trend="up"
            trendValue="2"
            icon={<CreditCard className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Monthly Income"
            value="$780"
            description="+$45 from last month"
            trend="up"
            trendValue="$45"
            icon={<BarChart3 className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassmorphicCard
            title="Portfolio Performance"
            description="Your investment growth over time"
            accentColor={accentColor}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
                  <Area type="monotone" dataKey="value" stroke={accentColor} fill={accentColor} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassmorphicCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassmorphicCard
            title="Investment Opportunities"
            description="New tokenized assets available for investment"
            accentColor={accentColor}
          >
            <div className="space-y-4 py-2">
              <OpportunityCard
                title="Electric Bus Fleet"
                yield="5.2%"
                minInvestment="$1,000"
                available="$245,000"
                index={0}
                accentColor={accentColor}
              />
              <OpportunityCard
                title="Taxi EV Network"
                yield="4.8%"
                minInvestment="$500"
                available="$120,000"
                index={1}
                accentColor={accentColor}
              />
              <OpportunityCard
                title="Delivery Vans"
                yield="5.5%"
                minInvestment="$2,000"
                available="$380,000"
                index={2}
                accentColor={accentColor}
              />
            </div>
          </GlassmorphicCard>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <GlassmorphicCard
            title="Yield Trends"
            description="Monthly yield percentage"
            accentColor={accentColor}
          >
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
          </GlassmorphicCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassmorphicCard
            title="Asset Distribution"
            description="Breakdown of your investment portfolio"
            accentColor={accentColor}
          >
            <ChartPlaceholder
              height="h-80"
              type="pie"
              title="Asset Distribution"
              description="Breakdown by vehicle type"
              accentColor={accentColor}
            />
          </GlassmorphicCard>
        </motion.div>
      </div>
    </motion.div>
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
  index?: number
  accentColor?: string
}

function OpportunityCard({ title, yield: yieldValue, minInvestment, available, index = 0, accentColor = "#fbdc3e" }: OpportunityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <CreditCard className="h-4 w-4" style={{ color: accentColor }} />
            </div>
            <h3 className="font-medium">{title}</h3>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>Yield: {yieldValue}</span>
            <span>Min: {minInvestment}</span>
            <span>Available: {available}</span>
          </div>
        </div>
        <Button
          className="transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: accentColor, color: "#4f1964" }}
        >
          Invest
        </Button>
      </div>
    </motion.div>
  )
}
