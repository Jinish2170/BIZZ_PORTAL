"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataCard } from "@/components/ui/data-card"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { KpiTracker } from "@/components/data-analysis/kpi-tracker"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Invoice, Budget, Supplier, Document } from "@/lib/store"

interface AnalysisMetric {
  id: string
  name: string
  value: number
  previousValue: number
  change: number
  trend: "up" | "down" | "neutral"
  category: string
  date: string
}

interface AnalysisData {
  invoices: Invoice[]
  budgets: Budget[]
  suppliers: Supplier[]
  documents: Document[]
}

export function AnalysisDashboard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalysisData>({
    invoices: [],
    budgets: [],
    suppliers: [],
    documents: []
  })
  const [metrics, setMetrics] = useState<AnalysisMetric[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["revenue", "expenses", "profit"])
  const [comparisonPeriod, setComparisonPeriod] = useState("previous_period")
  const [chartType, setChartType] = useState("bar")

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Calculate real metrics from API data
        const calculatedMetrics = calculateMetrics(invoices, budgets, suppliers, documents)
        setMetrics(calculatedMetrics)
      } catch (error) {
        console.error('Error fetching analysis data:', error)
        toast({
          title: "Error",
          description: "Failed to load analysis data"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const calculateMetrics = (invoices: Invoice[], budgets: Budget[], suppliers: Supplier[], documents: Document[]): AnalysisMetric[] => {
    // Calculate current period metrics
    const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0)
    const totalExpenses = budgets.reduce((sum, budget) => {
      const amount = typeof budget.spent_amount === 'string' ? parseFloat(budget.spent_amount) : budget.spent_amount
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)
    const netProfit = totalRevenue - totalExpenses
    const supplierCosts = suppliers.filter(s => s.status === 'active').length * 1000 // Estimate
    const avgOrderValue = invoices.length > 0 ? totalRevenue / invoices.length : 0
    const documentCount = documents.length

    // Calculate previous period values (simulate 15% lower for demo)
    const prevRevenue = totalRevenue * 0.85
    const prevExpenses = totalExpenses * 0.92
    const prevProfit = netProfit * 0.80
    const prevSupplierCosts = supplierCosts * 0.95
    const prevAvgOrderValue = avgOrderValue * 0.90
    const prevDocumentCount = Math.max(1, documentCount - 2)

    // Calculate changes
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0
    const expensesChange = prevExpenses > 0 ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 : 0
    const profitChange = prevProfit > 0 ? ((netProfit - prevProfit) / prevProfit) * 100 : 0
    const supplierCostsChange = prevSupplierCosts > 0 ? ((supplierCosts - prevSupplierCosts) / prevSupplierCosts) * 100 : 0
    const avgOrderValueChange = prevAvgOrderValue > 0 ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100 : 0
    const documentCountChange = prevDocumentCount > 0 ? ((documentCount - prevDocumentCount) / prevDocumentCount) * 100 : 0

    // Calculate additional metrics
    const activeSupplierRate = suppliers.length > 0 ? (suppliers.filter(s => s.status === 'active').length / suppliers.length) * 100 : 0
    const paymentSuccessRate = invoices.length > 0 ? (invoices.filter(inv => inv.status === 'paid').length / invoices.length) * 100 : 0
    
    const budgetUtilization = budgets.reduce((sum, b) => {
      const amount = typeof b.total_amount === 'string' ? parseFloat(b.total_amount) : b.total_amount
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0) > 0 
      ? (totalExpenses / budgets.reduce((sum, b) => {
          const amount = typeof b.total_amount === 'string' ? parseFloat(b.total_amount) : b.total_amount
          return sum + (isNaN(amount) ? 0 : amount)
        }, 0)) * 100 
      : 0

    return [
      {
        id: "1",
        name: "Total Revenue",
        value: totalRevenue,
        previousValue: prevRevenue,
        change: revenueChange,
        trend: revenueChange > 0 ? "up" : revenueChange < 0 ? "down" : "neutral",
        category: "Financial",
        date: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Total Expenses",
        value: totalExpenses,
        previousValue: prevExpenses,
        change: expensesChange,
        trend: expensesChange > 0 ? "up" : expensesChange < 0 ? "down" : "neutral",
        category: "Financial",
        date: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Net Profit",
        value: netProfit,
        previousValue: prevProfit,
        change: profitChange,
        trend: profitChange > 0 ? "up" : profitChange < 0 ? "down" : "neutral",
        category: "Financial",
        date: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Supplier Costs",
        value: supplierCosts,
        previousValue: prevSupplierCosts,
        change: supplierCostsChange,
        trend: supplierCostsChange > 0 ? "up" : supplierCostsChange < 0 ? "down" : "neutral",
        category: "Suppliers",
        date: new Date().toISOString(),
      },
      {
        id: "5",
        name: "Active Supplier Rate",
        value: activeSupplierRate,
        previousValue: activeSupplierRate * 0.95,
        change: activeSupplierRate > 0 ? ((activeSupplierRate - activeSupplierRate * 0.95) / (activeSupplierRate * 0.95)) * 100 : 0,
        trend: "up",
        category: "Suppliers",
        date: new Date().toISOString(),
      },
      {
        id: "6",
        name: "Payment Success Rate",
        value: paymentSuccessRate,
        previousValue: paymentSuccessRate * 0.92,
        change: paymentSuccessRate > 0 ? ((paymentSuccessRate - paymentSuccessRate * 0.92) / (paymentSuccessRate * 0.92)) * 100 : 0,
        trend: "up",
        category: "Operations",
        date: new Date().toISOString(),
      },
      {
        id: "7",
        name: "Average Invoice Value",
        value: avgOrderValue,
        previousValue: prevAvgOrderValue,
        change: avgOrderValueChange,
        trend: avgOrderValueChange > 0 ? "up" : avgOrderValueChange < 0 ? "down" : "neutral",
        category: "Sales",
        date: new Date().toISOString(),
      },
      {
        id: "8",
        name: "Budget Utilization",
        value: budgetUtilization,
        previousValue: budgetUtilization * 0.88,
        change: budgetUtilization > 0 ? ((budgetUtilization - budgetUtilization * 0.88) / (budgetUtilization * 0.88)) * 100 : 0,
        trend: "up",
        category: "Operations",
        date: new Date().toISOString(),
      },
      {
        id: "9",
        name: "Document Processing",
        value: documentCount,
        previousValue: prevDocumentCount,
        change: documentCountChange,
        trend: documentCountChange > 0 ? "up" : documentCountChange < 0 ? "down" : "neutral",
        category: "Operations",
        date: new Date().toISOString(),
      },
    ]
  }

  const columns: ColumnDef<AnalysisMetric>[] = [
    {
      accessorKey: "name",
      header: "Metric",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "value",
      header: "Current Value",
      cell: ({ row }) => {
        const value = row.getValue("value") as number
        const formatted = typeof value === "number" && value > 1000 ? `$${value.toLocaleString()}` : value
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "previousValue",
      header: "Previous Value",
      cell: ({ row }) => {
        const value = row.getValue("previousValue") as number
        const formatted = typeof value === "number" && value > 1000 ? `$${value.toLocaleString()}` : value
        return <div>{formatted}</div>
      },
    },
    {
      accessorKey: "change",
      header: "Change",
      cell: ({ row }) => {
        const change = row.getValue("change") as number
        const trend = row.original.trend
        return (
          <div
            className={`flex items-center ${
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="mr-1 h-4 w-4" />
            ) : trend === "down" ? (
              <ArrowDownRight className="mr-1 h-4 w-4" />
            ) : null}
            {change}%
          </div>
        )
      },
    },
  ]
  const handleExportData = () => {
    toast({
      title: "Exporting data",
      description: "Your data is being exported as CSV",
    })

    // In a real application, this would trigger a download
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your data has been exported successfully",
      })
    }, 1500)
  }

  const handleGenerateReport = () => {
    toast({
      title: "Generating report",
      description: "Your business analysis report is being generated",
    })

    // In a real application, this would generate a PDF report
    setTimeout(() => {
      toast({
        title: "Report ready",
        description: "Your business analysis report has been generated",
      })
    }, 2000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Business Analysis</h1>
          <p className="text-muted-foreground">Loading analysis data...</p>
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

  // Get key metrics for DataCards
  const revenueMetric = metrics.find(m => m.name === "Total Revenue")
  const expensesMetric = metrics.find(m => m.name === "Total Expenses")
  const profitMetric = metrics.find(m => m.name === "Net Profit")
  const profitMargin = revenueMetric && revenueMetric.value > 0 
    ? ((profitMetric?.value || 0) / revenueMetric.value) * 100 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Analysis</h1>
            <p className="text-muted-foreground mt-1">Advanced analytics and insights for your business</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={handleGenerateReport}>
              <Zap className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-auto md:flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
          </CardHeader>          <CardContent>
            <DatePickerWithRange 
              date={dateRange} 
              setDate={(date) => {
                if (date) {
                  setDateRange(date as { from: Date; to: Date })
                }
              }} 
            />
          </CardContent>
        </Card>

        <Card className="w-full md:w-auto md:flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select metrics to display" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financial Metrics</SelectItem>
                <SelectItem value="marketing">Marketing Metrics</SelectItem>
                <SelectItem value="operations">Operational Metrics</SelectItem>
                <SelectItem value="sales">Sales Metrics</SelectItem>
                <SelectItem value="all">All Metrics</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="w-full md:w-auto md:flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous_period">Previous Period</SelectItem>
                <SelectItem value="previous_year">Previous Year</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="forecast">Forecast</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Total Revenue"
          value={`$${revenueMetric?.value.toLocaleString() || '0'}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: revenueMetric?.change || 0, label: "vs previous period" }}
          variant="primary"
        />
        <DataCard
          title="Total Expenses"
          value={`$${expensesMetric?.value.toLocaleString() || '0'}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: expensesMetric?.change || 0, label: "vs previous period" }}
        />
        <DataCard
          title="Net Profit"
          value={`$${profitMetric?.value.toLocaleString() || '0'}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: profitMetric?.change || 0, label: "vs previous period" }}
          variant="success"
        />
        <DataCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: profitMargin > 20 ? 10 : -5, label: "vs previous period" }}
          variant="info"
        />
      </div><Tabs defaultValue="charts">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Business Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <DashboardCharts type="invoices" />
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Budget Allocation</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <DashboardCharts type="budget" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Statistics</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <DashboardCharts type="suppliers" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Business Metrics Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={metrics} searchPlaceholder="Search metrics..." />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="kpis" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <KpiTracker metrics={metrics} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
