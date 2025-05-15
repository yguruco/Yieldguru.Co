"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { ShieldCheck, CalendarClock, Info, Clock, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApprovedLoan {
  id: string
  name: string
  amount: number
  status: string
  createdAt: string
  repaymentAmount: number
  duration: number
  monthlyInterest: number
}

interface ApplicationStats {
  approved: number
  rejected: number
  pending: number
}

export default function OperatorDashboardPage() {
  const [approvedLoans, setApprovedLoans] = useState<ApprovedLoan[]>([])
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    approved: 0,
    rejected: 0,
    pending: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real data from localStorage
    const fetchData = () => {
      setLoading(true)
      try {
        // Get loans from localStorage
        const adminLoansStr = localStorage.getItem("adminLoans")
        const adminLoans = adminLoansStr ? JSON.parse(adminLoansStr) : []
        
        // Filter loans that belong to the current operator
        // In a real app, we would filter by the current user's address
        const operatorLoans = adminLoans.filter(
          (loan: any) => loan.status === "Active"
        )
        
        // Get RFL applications from localStorage
        const rflSubmissionsStr = localStorage.getItem("rflSubmissions")
        const rflSubmissions = rflSubmissionsStr ? JSON.parse(rflSubmissionsStr) : []
        
        // Calculate application stats
        const approved = operatorLoans.length
        const pending = rflSubmissions.filter(
          (sub: any) => sub.status === "pending" || sub.status === "in-review"
        ).length
        const rejected = rflSubmissions.filter(
          (sub: any) => sub.status === "rejected"
        ).length
        
        // Set the data
        setApprovedLoans(operatorLoans)
        setApplicationStats({
          approved,
          rejected,
          pending
        })
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate total loan value and other stats
  const totalLoanValue = approvedLoans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalRepaymentValue = approvedLoans.reduce((sum, loan) => sum + loan.repaymentAmount, 0)
  const averageDuration = approvedLoans.length 
    ? Math.round(approvedLoans.reduce((sum, loan) => sum + loan.duration, 0) / approvedLoans.length) 
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">EV-Operator Dashboard</h1>
        <p className="text-muted-foreground">Monitor your EV loans and applications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Loan Value"
          value={`$${totalLoanValue.toLocaleString()}`}
          description="Total value of approved EV loans"
          trend="up"
          trendValue=""
        />
        <StatCard
          title="Approved Applications"
          value={applicationStats.approved.toString()}
          description="Number of approved applications"
          trend="up"
          trendValue=""
          className="bg-green-50 border-green-100"
          icon={<ShieldCheck className="h-4 w-4 text-green-500" />}
        />
        <StatCard
          title="Pending Applications"
          value={applicationStats.pending.toString()}
          description="Awaiting approval decision"
          trend="neutral"
          trendValue=""
          className="bg-amber-50 border-amber-100"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <StatCard
          title="Rejected Applications"
          value={applicationStats.rejected.toString()}
          description="Applications that were declined"
          trend="down"
          trendValue=""
          className="bg-red-50 border-red-100"
          icon={<XCircle className="h-4 w-4 text-red-500" />}
        />
      </div>

      {/* Application timeline summary */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Progress bar */}
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              {/* Only show if there are any applications */}
              {(applicationStats.approved + applicationStats.rejected + applicationStats.pending) > 0 && (
                <>
                  <div 
                    className="h-full bg-green-500 float-left" 
                    style={{ 
                      width: `${applicationStats.approved / (applicationStats.approved + applicationStats.rejected + applicationStats.pending) * 100}%` 
                    }}
                  ></div>
                  <div 
                    className="h-full bg-amber-500 float-left" 
                    style={{ 
                      width: `${applicationStats.pending / (applicationStats.approved + applicationStats.rejected + applicationStats.pending) * 100}%` 
                    }}
                  ></div>
                  <div 
                    className="h-full bg-red-500 float-left" 
                    style={{ 
                      width: `${applicationStats.rejected / (applicationStats.approved + applicationStats.rejected + applicationStats.pending) * 100}%` 
                    }}
                  ></div>
                </>
              )}
            </div>
            
            {/* Legend */}
            <div className="flex justify-between mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Approved ({applicationStats.approved})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-sm">Pending ({applicationStats.pending})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">Rejected ({applicationStats.rejected})</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approved Loans</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-[#f68b27] border-t-transparent rounded-full"></div>
            </div>
          ) : approvedLoans.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No approved loans found. Apply for new EV loans through the RFL application process.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {approvedLoans.map((loan) => (
                <Card key={loan.id} className="border-2 border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-semibold text-lg">{loan.name}</div>
                      <div className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        {loan.status}
                      </div>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Loan Amount:</span>
                        <span className="font-medium">${loan.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Repayment Amount:</span>
                        <span className="font-medium">${loan.repaymentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{loan.duration} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Monthly Interest:</span>
                        <span className="font-medium">{loan.monthlyInterest}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100 mt-2">
                        <div className="flex items-center">
                          <CalendarClock className="h-3 w-3 mr-1" />
                          Created: {new Date(loan.createdAt).toLocaleDateString()}
                        </div>
                        <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">ID: {loan.id}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
