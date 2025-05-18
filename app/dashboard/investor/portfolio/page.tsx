"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LineChart, BarChart, PieChart, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder"

interface InvestedLoan {
  id: string
  name: string
  image?: string | null
  operator: string
  amount: number
  yield: number
  duration: number
  status: string
  investedAmount: number
  investmentDate: string
  monthlyInterest?: number
}

export default function InvestorPortfolioPage() {
  const [investments, setInvestments] = useState<InvestedLoan[]>([])
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    averageYield: 0,
    totalAssets: 0,
    monthlyIncome: 0
  })

  useEffect(() => {
    // Load investor's portfolio from localStorage
    const portfolioLoans = JSON.parse(localStorage.getItem("portfolioLoans") || "[]");

    if (portfolioLoans.length > 0) {
      setInvestments(portfolioLoans);

      // Calculate portfolio statistics
      const totalValue = portfolioLoans.reduce((sum: number, loan: InvestedLoan) => sum + loan.investedAmount, 0);
      const totalYield = portfolioLoans.reduce((sum: number, loan: InvestedLoan) => sum + (loan.yield * loan.investedAmount), 0);
      const averageYield = totalValue > 0 ? parseFloat((totalYield / totalValue).toFixed(2)) : 0;

      // Calculate monthly income (based on yield)
      const monthlyIncome = portfolioLoans.reduce((sum: number, loan: InvestedLoan) => {
        const monthlyYield = loan.monthlyInterest || (loan.yield / 12);
        return sum + (loan.investedAmount * (monthlyYield / 100));
      }, 0);

      setPortfolioStats({
        totalValue,
        averageYield,
        totalAssets: portfolioLoans.length,
        monthlyIncome: parseFloat(monthlyIncome.toFixed(2))
      });
    }
  }, []);

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

  // Get accent color for investor dashboard
  const accentColor = "#fbdc3e";

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                boxShadow: `0 3px 10px ${accentColor}40`
              }}
            >
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight shimmer">My Portfolio</h1>
          </div>
          <p className="text-muted-foreground">Track and manage your EV asset investments</p>
        </div>
        <Button className="bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">
          <PieChart className="mr-2 h-4 w-4" />
          Portfolio Analysis
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Updated as of today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioStats.averageYield}%</div>
            <p className="text-xs text-muted-foreground">Average annual yield</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioStats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">Active investments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioStats.monthlyIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Expected monthly returns</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <GlassmorphicCard
            title="Portfolio Allocation"
            description="Distribution by asset type"
            accentColor={accentColor}
          >
            <ChartPlaceholder
              height={300}
              type="pie"
              title="Asset Allocation"
              description="Breakdown by vehicle type"
              accentColor={accentColor}
            />
          </GlassmorphicCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassmorphicCard
            title="Performance History"
            description="Monthly returns over time"
            accentColor={accentColor}
          >
            <ChartPlaceholder
              height={300}
              type="bar"
              title="Performance Chart"
              description="Monthly returns"
              accentColor={accentColor}
            />
          </GlassmorphicCard>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Investments</CardTitle>
          <CardDescription>All your current EV asset investments</CardDescription>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You have no investments yet. Visit the Marketplace to start investing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {investments.map((investment) => (
                <div key={investment.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{investment.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>ID: {investment.id}</span>
                        <span>•</span>
                        <span>Operator: {investment.operator}</span>
                        <Badge
                          className={
                            investment.status === "Active"
                              ? "bg-green-500"
                              : investment.status === "Pending"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }
                        >
                          {investment.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${investment.investedAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Yield: {investment.yield}%</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Investment Date: {new Date(investment.investmentDate).toLocaleDateString()}</span>
                      <span className="font-medium">
                        ${((investment.investedAmount * (investment.monthlyInterest || (investment.yield / 12)) / 100)).toFixed(2)} monthly
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, (investment.investedAmount / investment.amount) * 100)}
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
