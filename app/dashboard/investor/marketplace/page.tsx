"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Search, Percent, InfoIcon, Clock } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Loan {
  id: string
  name: string
  image: string | null
  operator: string
  borrower: string
  adminAddress: string
  amount: number
  repaymentAmount: number
  monthlyInterest?: number
  duration: number
  createdAt: string
  status: string
  transactionHash?: string
}

interface MarketplaceLoan extends Loan {
  yield: number
  available: number
  minInvestment: number
  invested?: number
}

export default function MarketplacePage() {
  const [loans, setLoans] = useState<MarketplaceLoan[]>([])
  const [filteredLoans, setFilteredLoans] = useState<MarketplaceLoan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYield, setSelectedYield] = useState("All")
  const [selectedValue, setSelectedValue] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const [investmentProgress, setInvestmentProgress] = useState(0)

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

  useEffect(() => {
    // Load admin-created loans from localStorage
    const adminLoans = JSON.parse(localStorage.getItem("adminLoans") || "[]");

    // Transform admin loans into marketplace loans
    const marketplaceLoans = adminLoans.map((loan: Loan) => {
      // Calculate the annual yield (simple calculation based on monthly interest)
      const yearlyYield = loan.monthlyInterest
        ? loan.monthlyInterest * 12
        : (((loan.repaymentAmount / loan.amount) - 1) * 100) / (loan.duration / 12);

      // Randomize the available amount (70-95% of total)
      const availablePercentage = Math.random() * 25 + 70;
      const available = Math.round(loan.amount * (availablePercentage / 100));

      // Set minimum investment at 1-5% of the loan amount
      const minPercentage = Math.random() * 4 + 1;
      const minInvestment = Math.round(loan.amount * (minPercentage / 100));

      return {
        ...loan,
        yield: parseFloat(yearlyYield.toFixed(2)),
        available: available,
        minInvestment: minInvestment,
      };
    });

    if (marketplaceLoans.length > 0) {
      setLoans(marketplaceLoans);
      setFilteredLoans(marketplaceLoans);
    } else {
      // Use default loans if no admin loans are found
      const defaultMarketplaceLoans = convertDefaultLoansToMarketplace(defaultLoans);
      setLoans(defaultMarketplaceLoans);
      setFilteredLoans(defaultMarketplaceLoans);
      localStorage.setItem("marketplaceLoans", JSON.stringify(defaultMarketplaceLoans));
    }
  }, []);

  useEffect(() => {
    // Filter loans based on search term and filters
    let result = [...loans]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (loan) =>
          loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply yield filter
    if (selectedYield !== "All") {
      if (selectedYield === "Under 5%") {
        result = result.filter((loan) => loan.yield < 5)
      } else if (selectedYield === "5-10%") {
        result = result.filter((loan) => loan.yield >= 5 && loan.yield <= 10)
      } else if (selectedYield === "Over 10%") {
        result = result.filter((loan) => loan.yield > 10)
      }
    }

    // Apply value filter
    if (selectedValue !== "All") {
      if (selectedValue === "Under $100K") {
        result = result.filter((loan) => loan.amount < 100000)
      } else if (selectedValue === "$100K-$500K") {
        result = result.filter((loan) => loan.amount >= 100000 && loan.amount <= 500000)
      } else if (selectedValue === "Over $500K") {
        result = result.filter((loan) => loan.amount > 500000)
      }
    }

    // Apply status filter
    if (selectedStatus !== "All") {
      result = result.filter((loan) => loan.status === selectedStatus)
    }

    setFilteredLoans(result)
  }, [loans, searchTerm, selectedYield, selectedValue, selectedStatus])

  const handleInvest = (loanId: string) => {
    setSelectedInvestment(loanId)
    setInvestmentAmount("")
  }

  const closeInvestmentModal = () => {
    setSelectedInvestment(null)
    setInvestmentAmount("")
  }

  const handleSubmitInvestment = async () => {
    if (!selectedInvestment || !investmentAmount) return;

    const amount = parseFloat(investmentAmount);
    const loan = loans.find(l => l.id === selectedInvestment);

    if (!loan) return;
    if (amount < loan.minInvestment) return;
    if (amount > loan.available) return;

    setIsInvesting(true);
    setInvestmentProgress(0);

    // Simulate investment process
    for (let i = 1; i <= 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setInvestmentProgress(i * 20);
    }

    // Update loan available amount
    const updatedLoans = loans.map(l => {
      if (l.id === selectedInvestment) {
        return {
          ...l,
          available: l.available - amount,
          invested: (l.invested || 0) + amount
        };
      }
      return l;
    });

    setLoans(updatedLoans);
    setFilteredLoans(updatedLoans);

    // Store updated portfolio in localStorage
    const portfolioLoans = JSON.parse(localStorage.getItem("portfolioLoans") || "[]");
    const existingLoanIndex = portfolioLoans.findIndex((p: any) => p.id === selectedInvestment);

    if (existingLoanIndex >= 0) {
      portfolioLoans[existingLoanIndex].investedAmount += amount;
    } else {
      const investedLoan = {
        ...loan,
        investedAmount: amount,
        investmentDate: new Date().toISOString(),
      };
      portfolioLoans.push(investedLoan);
    }

    localStorage.setItem("portfolioLoans", JSON.stringify(portfolioLoans));

    // Reset form
    setIsInvesting(false);
    setSelectedInvestment(null);
    setInvestmentAmount("");
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">Browse and invest in tokenized EV loans</p>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Available Loans</CardTitle>
          <CardDescription>Browse tokenized EV loans available for investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search loans by name, operator, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={selectedYield}
                  onChange={(e) => setSelectedYield(e.target.value)}
                >
                  <option value="All">All Yields</option>
                  <option value="Under 5%">Under 5%</option>
                  <option value="5-10%">5-10%</option>
                  <option value="Over 10%">Over 10%</option>
                </select>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  <option value="All">All Values</option>
                  <option value="Under $100K">Under $100K</option>
                  <option value="$100K-$500K">$100K-$500K</option>
                  <option value="Over $500K">Over $500K</option>
                </select>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {filteredLoans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No loans available matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredLoans.map((loan, index) => (
                <Card key={loan.id} className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={loan.image || "/placeholder.svg?height=200&width=300"}
                      alt={loan.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={`${loan.status === "Active" ? "bg-green-500" : "bg-yellow-500"}`}>
                        {loan.status}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-[#4f1964]">EV Loan</Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{loan.name}</CardTitle>
                    <CardDescription>ID: {loan.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Loan Amount</p>
                        <p className="font-bold">${loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Annual Yield</p>
                        <p className="font-bold text-green-600 flex items-center">
                          {loan.yield}% <Percent className="h-4 w-4 ml-1" />
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Available</p>
                        <p className="font-bold">${loan.available.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Min. Investment</p>
                        <p className="font-bold">${loan.minInvestment.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Operator:</span>
                        <span className="font-medium">{loan.operator}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{loan.duration} months</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Monthly Interest:</span>
                        <span className="font-medium">
                          {loan.monthlyInterest ? loan.monthlyInterest : ((loan.yield || 0) / 12).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium">{new Date(loan.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button
                      className="w-full bg-[#fbdc3e] text-black hover:bg-[#fbdc3e]/90"
                      onClick={() => handleInvest(loan.id)}
                      disabled={loan.available < loan.minInvestment}
                    >
                      Invest
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedInvestment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Make Investment</CardTitle>
                  <CardDescription>
                    {loans.find(l => l.id === selectedInvestment)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isInvesting ? (
                    <div className="py-6 space-y-4">
                      <Progress value={investmentProgress} />
                      <p className="text-center text-sm text-muted-foreground">
                        Processing investment... {investmentProgress}%
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="loan-amount">Available</Label>
                            <div className="font-medium pt-2">
                              ${loans.find(l => l.id === selectedInvestment)?.available.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="min-investment">Min. Investment</Label>
                            <div className="font-medium pt-2">
                              ${loans.find(l => l.id === selectedInvestment)?.minInvestment.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <Alert className="bg-blue-50 border-blue-200">
                          <InfoIcon className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-700">
                            Annual yield: {loans.find(l => l.id === selectedInvestment)?.yield}%
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <Label htmlFor="investment-amount">Investment Amount ($)</Label>
                          <Input
                            id="investment-amount"
                            type="number"
                            placeholder="Enter amount to invest"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={closeInvestmentModal}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1 bg-[#fbdc3e] text-black hover:bg-[#fbdc3e]/90"
                          onClick={handleSubmitInvestment}
                          disabled={
                            !investmentAmount ||
                            parseFloat(investmentAmount) < (loans.find(l => l.id === selectedInvestment)?.minInvestment || 0) ||
                            parseFloat(investmentAmount) > (loans.find(l => l.id === selectedInvestment)?.available || 0)
                          }
                        >
                          Confirm Investment
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Convert default loans to marketplace format
function convertDefaultLoansToMarketplace(defaultLoans: Loan[]): MarketplaceLoan[] {
  return defaultLoans.map(loan => {
    const yearlyYield = loan.monthlyInterest
      ? loan.monthlyInterest * 12
      : (((loan.repaymentAmount / loan.amount) - 1) * 100) / (loan.duration / 12);

    const availablePercentage = Math.random() * 25 + 70;
    const available = Math.round(loan.amount * (availablePercentage / 100));

    const minPercentage = Math.random() * 4 + 1;
    const minInvestment = Math.round(loan.amount * (minPercentage / 100));

    return {
      ...loan,
      yield: parseFloat(yearlyYield.toFixed(2)),
      available: available,
      minInvestment: minInvestment,
    };
  });
}

// Default loans in case there are no admin-created loans
const defaultLoans: Loan[] = [
  {
    id: "LOAN-001",
    name: "EV Loan - MetroTransit",
    image: "/images/electric-bus.jpeg",
    operator: "MetroTransit",
    borrower: "0x8Ab76F03D2Acf190705EE1FcA0C794931EE2A3B0",
    adminAddress: "0x4a2de44F7c609Af73852CC99a3fCc318A91C83Bd",
    amount: 450000,
    repaymentAmount: 495000,
    monthlyInterest: 0.83,
    duration: 24,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: "Active",
    transactionHash: "0x" + "1".repeat(64),
  },
  {
    id: "LOAN-002",
    name: "EV Loan - EcoDelivery",
    image: "/images/ford-vehicle.jpeg",
    operator: "EcoDelivery",
    borrower: "0x8Ab76F03D2Acf190705EE1FcA0C794931EE2A3B0",
    adminAddress: "0x4a2de44F7c609Af73852CC99a3fCc318A91C83Bd",
    amount: 85000,
    repaymentAmount: 93500,
    monthlyInterest: 0.55,
    duration: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    status: "Active",
    transactionHash: "0x" + "2".repeat(64),
  },
  {
    id: "LOAN-003",
    name: "EV Loan - GreenCab",
    image: "/images/ford.jpeg",
    operator: "GreenCab",
    borrower: "0x8Ab76F03D2Acf190705EE1FcA0C794931EE2A3B0",
    adminAddress: "0x4a2de44F7c609Af73852CC99a3fCc318A91C83Bd",
    amount: 320000,
    repaymentAmount: 368000,
    monthlyInterest: 0.5,
    duration: 36,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: "Pending",
    transactionHash: "0x" + "3".repeat(64),
  }
];
