"use client"

import { useState, useCallback } from "react"
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("month")
  const { toast } = useToast()

  // Bar chart data
  const supplierPerformanceData = {
    labels: ["Supplier A", "Supplier B", "Supplier C", "Supplier D", "Supplier E"],
    datasets: [
      {
        label: "Performance Score",
        data: [85, 72, 90, 65, 78],
        backgroundColor: "rgba(24, 144, 255, 0.6)",
        borderColor: "rgba(24, 144, 255, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  // Pie chart data
  const budgetAllocationData = {
    labels: ["Marketing", "Operations", "IT", "HR", "R&D"],
    datasets: [
      {
        label: "Budget Allocation",
        data: [25000, 35000, 20000, 10000, 10000],
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

  // Line chart data
  const monthlyExpensesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Actual Expenses",
        data: [12000, 19000, 15000, 17000, 22000, 18000],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Projected Expenses",
        data: [15000, 18000, 16000, 19000, 20000, 21000],
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

  // Summary statistics
  const summaryStats = {
    totalBudget: "$100,000",
    totalSpent: "$68,000",
    averageSupplierScore: "78/100",
    topPerformer: "Supplier C (90/100)",
    documentCount: "7",
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
                          ...chartOptions.plugins,
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const label = context.label || ""
                                const value = context.raw || 0
                                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                                const percentage = Math.round((value / total) * 100)
                                return `${label}: $${value.toLocaleString()} (${percentage}%)`
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
              </div>
              <CardContent className="p-0">
                <div className="border-t">
                  {[
                    {
                      title: "Operations budget utilization is 20% higher than last quarter",
                      trend: "up",
                      description: "Operations department has increased spending on new equipment and training.",
                    },
                    {
                      title: "Marketing expenses are trending 8% below projections",
                      trend: "down",
                      description: "Digital marketing campaigns have been more cost-effective than anticipated.",
                    },
                    {
                      title: "Supplier C has maintained top performance for 3 consecutive months",
                      trend: "up",
                      description: "Consider negotiating a long-term contract with preferred terms.",
                    },
                    {
                      title: "Document uploads have remained consistent with previous period",
                      trend: "neutral",
                      description: "No significant change in documentation workflow detected.",
                    },
                  ].map((item, i) => (
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
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
