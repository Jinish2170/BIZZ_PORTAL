"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, BarChart2, PieChart, LineChart, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataCard } from "@/components/ui/data-card"
import { AdvancedChart } from "@/components/data-analysis/advanced-chart"
import { PredictiveChart } from "@/components/data-analysis/predictive-chart"
import { ComparisonChart } from "@/components/data-analysis/comparison-chart"
import { KpiTracker } from "@/components/data-analysis/kpi-tracker"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

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

export function AnalysisDashboard() {
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["revenue", "expenses", "profit"])
  const [comparisonPeriod, setComparisonPeriod] = useState("previous_period")
  const [chartType, setChartType] = useState("bar")

  // Sample data for metrics
  const metrics: AnalysisMetric[] = [
    {
      id: "1",
      name: "Total Revenue",
      value: 125000,
      previousValue: 110000,
      change: 13.64,
      trend: "up",
      category: "Financial",
      date: "2025-03-01",
    },
    {
      id: "2",
      name: "Total Expenses",
      value: 85000,
      previousValue: 78000,
      change: 8.97,
      trend: "up",
      category: "Financial",
      date: "2025-03-01",
    },
    {
      id: "3",
      name: "Net Profit",
      value: 40000,
      previousValue: 32000,
      change: 25.0,
      trend: "up",
      category: "Financial",
      date: "2025-03-01",
    },
    {
      id: "4",
      name: "Supplier Costs",
      value: 45000,
      previousValue: 42000,
      change: 7.14,
      trend: "up",
      category: "Suppliers",
      date: "2025-03-01",
    },
    {
      id: "5",
      name: "Marketing ROI",
      value: 3.2,
      previousValue: 2.8,
      change: 14.29,
      trend: "up",
      category: "Marketing",
      date: "2025-03-01",
    },
    {
      id: "6",
      name: "Customer Acquisition Cost",
      value: 250,
      previousValue: 275,
      change: -9.09,
      trend: "down",
      category: "Marketing",
      date: "2025-03-01",
    },
    {
      id: "7",
      name: "Average Order Value",
      value: 1250,
      previousValue: 1150,
      change: 8.7,
      trend: "up",
      category: "Sales",
      date: "2025-03-01",
    },
    {
      id: "8",
      name: "Inventory Turnover",
      value: 5.8,
      previousValue: 5.2,
      change: 11.54,
      trend: "up",
      category: "Operations",
      date: "2025-03-01",
    },
  ]

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
          </CardHeader>
          <CardContent>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Total Revenue"
          value="$125,000"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 13.64, label: "vs previous period" }}
          variant="primary"
        />
        <DataCard
          title="Total Expenses"
          value="$85,000"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 8.97, label: "vs previous period" }}
        />
        <DataCard
          title="Net Profit"
          value="$40,000"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 25, label: "vs previous period" }}
          variant="success"
        />
        <DataCard
          title="Profit Margin"
          value="32%"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 10, label: "vs previous period" }}
          variant="info"
        />
      </div>

      <Tabs defaultValue="charts">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex gap-2">
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("bar")}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Bar
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("line")}
              >
                <LineChart className="h-4 w-4 mr-2" />
                Line
              </Button>
              <Button
                variant={chartType === "pie" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("pie")}
              >
                <PieChart className="h-4 w-4 mr-2" />
                Pie
              </Button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <AdvancedChart type={chartType} metrics={metrics} comparisonPeriod={comparisonPeriod} />
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
                  <CardTitle>Revenue by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AdvancedChart type="pie" metrics={metrics} comparisonPeriod={comparisonPeriod} category="revenue" />
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
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AdvancedChart type="pie" metrics={metrics} comparisonPeriod={comparisonPeriod} category="expenses" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Period Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ComparisonChart metrics={metrics} comparisonPeriod={comparisonPeriod} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Metrics Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={metrics} searchPlaceholder="Search metrics..." />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <PredictiveChart metrics={metrics} category="revenue" periods={6} />
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
                  <CardTitle>Expense Forecast</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <PredictiveChart metrics={metrics} category="expenses" periods={6} />
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
                  <CardTitle>Profit Forecast</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <PredictiveChart metrics={metrics} category="profit" periods={6} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
