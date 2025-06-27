"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Pie, Line } from "react-chartjs-2"
import { useToast } from "@/hooks/use-toast"
import { ArrowUpRight, DollarSign, Users, FileText, BarChart4, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Invoice, Budget, Supplier, Document } from "@/lib/store"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

interface AnalyticsData {
  invoices: Invoice[]
  budgets: Budget[]
  suppliers: Supplier[]
  documents: Document[]
}

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("month")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData>({
    invoices: [],
    budgets: [],
    suppliers: [],
    documents: []
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {      try {
        const [invoicesRes, budgetsRes, suppliersRes, documentsRes] = await Promise.all([
          fetch('/api/invoices'),
          fetch('/api/budgets'),
          fetch('/api/suppliers'),
          fetch('/api/documents')
        ])

        const [invoices, budgets, suppliers, documents] = await Promise.all([
          invoicesRes.json(),
          budgetsRes.json(),
          suppliersRes.json(),
          documentsRes.json()
        ])

        setData({ invoices, budgets, suppliers, documents })
      } catch (error) {
        console.error('Error fetching analytics data:', error)
        toast({
          title: "Error",
          description: "Failed to load analytics data"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Calculate analytics based on real data
  const calculateAnalytics = () => {    const totalBudget = data.budgets.reduce((sum, budget) => {
      const amount = typeof budget.total_amount === 'string' ? parseFloat(budget.total_amount) : budget.total_amount
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)
    const totalSpent = data.budgets.reduce((sum, budget) => {
      const amount = typeof budget.spent_amount === 'string' ? parseFloat(budget.spent_amount) : budget.spent_amount
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)
    const totalRevenue = data.invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount.toString()), 0)
    
    // Calculate supplier performance scores based on invoice payment status
    const supplierPerformance = data.suppliers.map(supplier => {
      const supplierInvoices = data.invoices.filter(inv => inv.supplier_name === supplier.name)
      const paidInvoices = supplierInvoices.filter(inv => inv.status === 'paid')
      const onTimeRate = supplierInvoices.length > 0 ? (paidInvoices.length / supplierInvoices.length) * 100 : 0
      
      // Performance score based on status and payment rate
      let score = supplier.status === 'active' ? 80 : 40
      score += onTimeRate * 0.2 // Add points for payment rate
      
      return {
        name: supplier.name,
        score: Math.min(100, Math.round(score))
      }
    })    // Budget allocation by category
    const budgetAllocation = data.budgets.reduce((acc, budget) => {
      const category = budget.name || 'Other' // Use budget name as category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += typeof budget.total_amount === 'string' ? parseFloat(budget.total_amount) : budget.total_amount
      return acc
    }, {} as Record<string, number>)

    // Monthly expenses trend
    const monthlyExpenses = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      const monthName = date.toLocaleDateString('en', { month: 'short' })
      
      // Simulate expenses for the month
      const baseExpense = totalSpent / 6
      const variance = (Math.random() - 0.5) * baseExpense * 0.3
      const actual = Math.max(0, baseExpense + variance)
      const projected = baseExpense * (1 + Math.random() * 0.2)
      
      return {
        month: monthName,
        actual: Math.round(actual),
        projected: Math.round(projected)
      }
    })

    return {
      totalBudget,
      totalSpent,
      totalRevenue,
      supplierPerformance,
      budgetAllocation,
      monthlyExpenses,
      documentCount: data.documents.length,
      averageSupplierScore: supplierPerformance.length > 0 
        ? Math.round(supplierPerformance.reduce((sum, s) => sum + s.score, 0) / supplierPerformance.length)
        : 0
    }
  }

  const analytics = calculateAnalytics()

  // Chart data based on real calculations
  const supplierPerformanceData = {
    labels: analytics.supplierPerformance.slice(0, 5).map(s => s.name),
    datasets: [
      {
        label: "Performance Score",
        data: analytics.supplierPerformance.slice(0, 5).map(s => s.score),
        backgroundColor: "rgba(24, 144, 255, 0.6)",
        borderColor: "rgba(24, 144, 255, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const budgetAllocationData = {
    labels: Object.keys(analytics.budgetAllocation),
    datasets: [
      {
        label: "Budget Allocation",
        data: Object.values(analytics.budgetAllocation),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const monthlyExpensesData = {
    labels: analytics.monthlyExpenses.map(m => m.month),
    datasets: [
      {
        label: "Actual Expenses",
        data: analytics.monthlyExpenses.map(m => m.actual),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Projected Expenses",
        data: analytics.monthlyExpenses.map(m => m.projected),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    animation: {
      duration: 1000,
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  }
  const handleChartClick = useCallback(
    (chartType: string, dataIndex: number) => {
      // In a real application, this would show detailed data or navigate to a detailed view
      toast({
        title: `${chartType} Chart Clicked`,
        description: `You clicked on data point ${dataIndex}. In a real app, this would show detailed information.`,
      })
    },
    [toast],
  )

  // Summary statistics based on real data
  const summaryStats = {
    totalBudget: `$${analytics.totalBudget.toLocaleString()}`,
    totalSpent: `$${analytics.totalSpent.toLocaleString()}`,
    averageSupplierScore: `${analytics.averageSupplierScore}/100`,
    topPerformer: analytics.supplierPerformance.length > 0 
      ? `${analytics.supplierPerformance.sort((a, b) => b.score - a.score)[0]?.name} (${analytics.supplierPerformance.sort((a, b) => b.score - a.score)[0]?.score}/100)`
      : "No data",
    documentCount: analytics.documentCount.toString(),
  }

  // Generate insights based on real data
  const generateInsights = () => {
    const insights = []
    
    const budgetUtilization = analytics.totalBudget > 0 ? (analytics.totalSpent / analytics.totalBudget) * 100 : 0
    
    if (budgetUtilization > 90) {
      insights.push({
        title: `Budget utilization is ${budgetUtilization.toFixed(1)}% - approaching limit`,
        trend: "up",
        description: "Consider reviewing expenses or requesting budget increase for next period.",
      })
    } else if (budgetUtilization < 50) {
      insights.push({
        title: `Budget utilization is ${budgetUtilization.toFixed(1)}% - well below target`,
        trend: "down",
        description: "There may be opportunities to invest in growth or optimization.",
      })
    }

    const activeSuppliers = data.suppliers.filter(s => s.status === 'active').length
    const totalSuppliers = data.suppliers.length
    
    if (activeSuppliers / totalSuppliers < 0.8) {
      insights.push({
        title: `Only ${Math.round((activeSuppliers / totalSuppliers) * 100)}% of suppliers are active`,
        trend: "down",
        description: "Consider reviewing supplier relationships and activating dormant suppliers.",
      })
    }

    const overdueInvoices = data.invoices.filter(inv => {
      const dueDate = new Date(inv.due_date)
      return dueDate < new Date() && inv.status === 'unpaid'
    }).length

    if (overdueInvoices > 0) {
      insights.push({
        title: `${overdueInvoices} invoices are overdue`,
        trend: "up",
        description: "Follow up on overdue payments to improve cash flow.",
      })
    }

    insights.push({
      title: `${analytics.documentCount} documents processed this period`,
      trend: "neutral",
      description: "Document processing is tracking within normal parameters.",
    })

    return insights.slice(0, 4) // Return max 4 insights
  }

  const insights = generateInsights()

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }
  return (
    <div className="p-6">
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground mt-1">Visualize and analyze your business performance</p>
            </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Period:</span>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold mt-1">{summaryStats.totalBudget}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                  <DollarSign className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <div className="flex items-center mr-2 text-emerald-500">
                  <ArrowUpRight className="mr-1 size-3.5" />
                  <span>12%</span>
                </div>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold mt-1">{summaryStats.totalSpent}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                  <DollarSign className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <div className="flex items-center mr-2 text-emerald-500">
                  <ArrowUpRight className="mr-1 size-3.5" />
                  <span>12%</span>
                </div>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Supplier Score</p>
                  <p className="text-2xl font-bold mt-1">{summaryStats.averageSupplierScore}</p>
                </div>
                <div className="rounded-full bg-green-500/10 p-2.5 text-green-500">
                  <Users className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <div className="flex items-center mr-2 text-emerald-500">
                  <ArrowUpRight className="mr-1 size-3.5" />
                  <span>5%</span>
                </div>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents</p>
                  <p className="text-2xl font-bold mt-1">{summaryStats.documentCount}</p>
                </div>
                <div className="rounded-full bg-blue-500/10 p-2.5 text-blue-500">
                  <FileText className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <div className="flex items-center mr-2 text-emerald-500">
                  <ArrowUpRight className="mr-1 size-3.5" />
                  <span>40%</span>
                </div>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="text-lg font-medium">Budget Allocation</h3>
                    <p className="text-sm text-muted-foreground">Current distribution</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="mr-2 h-3.5 w-3.5" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <Share2 className="mr-2 h-3.5 w-3.5" />
                      Share
                    </Button>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="h-[350px] p-6 pt-0">
                    <Pie
                      data={budgetAllocationData}
                      options={{
                        ...chartOptions,
                        onClick: (_, elements) => {
                          if (elements.length > 0) {
                            handleChartClick("Budget Allocation", elements[0].index)
                          }
                        },
                        plugins: {
                          ...chartOptions.plugins,                          tooltip: {
                            callbacks: {
                              label: (context: any) => {
                                const label = context.label || ""
                                const value = context.raw || 0
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                                const percentage = Math.round((Number(value) / total) * 100)
                                return `${label}: $${Number(value).toLocaleString()} (${percentage}%)`
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="text-lg font-medium">Supplier Performance</h3>
                    <p className="text-sm text-muted-foreground">Performance scores</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="mr-2 h-3.5 w-3.5" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <Share2 className="mr-2 h-3.5 w-3.5" />
                      Share
                    </Button>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="h-[350px] p-6 pt-0">
                    <Bar
                      options={{
                        ...chartOptions,
                        onClick: (_, elements) => {
                          if (elements.length > 0) {
                            handleChartClick("Supplier Performance", elements[0].index)
                          }
                        },
                      }}
                      data={supplierPerformanceData}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-lg font-medium">Monthly Expenses</h3>
                  <p className="text-sm text-muted-foreground">Actual vs Projected</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="mr-2 h-3.5 w-3.5" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Share2 className="mr-2 h-3.5 w-3.5" />
                    Share
                  </Button>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="h-[350px] p-6 pt-0">
                  <Line
                    options={{
                      ...chartOptions,
                      onClick: (_, elements) => {
                        if (elements.length > 0) {
                          handleChartClick("Monthly Expenses", elements[0].index)
                        }
                      },
                      interaction: {
                        mode: "index",
                        intersect: false,
                      },
                      hover: {
                        mode: "index",
                        intersect: false,
                      },
                    }}
                    data={monthlyExpensesData}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Key Insights</h3>
                </div>
              </div>              <CardContent className="p-0">
                <div className="border-t">
                  {insights.map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-4 border-b p-4 hover:bg-muted/50 cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      onClick={() =>
                        toast({
                          title: item.title,
                          description: item.description,
                        })
                      }
                    >
                      <div
                        className={`mt-1 ${
                          item.trend === "up"
                            ? "text-green-500"
                            : item.trend === "down"
                              ? "text-red-500"
                              : "text-amber-500"
                        }`}
                      >
                        {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→"}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 text-center">
                  <Button variant="outline" size="sm">
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
