"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { Invoice, Budget, Supplier, Document } from "@/lib/store"

interface KPI {
  name: string
  target: number
  actual: number
  unit: string
  trend: "up" | "down" | "neutral"
  status: "success" | "warning" | "danger"
}

export function KeyPerformanceIndicators() {
  const [kpis, setKpis] = useState<{
    financial: KPI[]
    operational: KPI[]
    suppliers: KPI[]
  }>({
    financial: [],
    operational: [],
    suppliers: []
  })
  const [loading, setLoading] = useState(true)

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

        // Calculate financial KPIs
        const totalRevenue = invoices.reduce((sum: number, inv: Invoice) => 
          sum + parseFloat(inv.amount.toString()), 0)
        const totalPaid = invoices
          .filter((inv: Invoice) => inv.status === 'paid')
          .reduce((sum: number, inv: Invoice) => sum + parseFloat(inv.amount.toString()), 0)
        const totalExpenses = budgets.reduce((sum: number, budget: Budget) => 
          sum + parseFloat(budget.spent_amount.toString()), 0)
        const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0

        // Calculate operational KPIs
        const activeSuppliers = suppliers.filter((s: Supplier) => s.status === 'active').length
        const totalSuppliers = suppliers.length
        const supplierActiveRate = totalSuppliers > 0 ? (activeSuppliers / totalSuppliers) * 100 : 0

        const overdueInvoices = invoices.filter((inv: Invoice) => {
          const dueDate = new Date(inv.due_date)
          return dueDate < new Date() && inv.status === 'unpaid'
        }).length
        const onTimePaymentRate = invoices.length > 0 ? 
          ((invoices.length - overdueInvoices) / invoices.length) * 100 : 100

        // Calculate budget utilization
        const totalBudget = budgets.reduce((sum: number, budget: Budget) => 
          sum + parseFloat(budget.total_amount.toString()), 0)
        const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0

        const financialKPIs: KPI[] = [
          {
            name: "Total Revenue",
            target: 100000,
            actual: totalRevenue,
            unit: "$",
            trend: totalRevenue > 80000 ? "up" : "down",
            status: totalRevenue > 80000 ? "success" : "warning"
          },
          {
            name: "Profit Margin",
            target: 25,
            actual: profitMargin,
            unit: "%",
            trend: profitMargin > 20 ? "up" : "down",
            status: profitMargin > 20 ? "success" : profitMargin > 10 ? "warning" : "danger"
          },
          {
            name: "Collection Rate",
            target: 95,
            actual: totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0,
            unit: "%",
            trend: "up",
            status: "success"
          }
        ]

        const operationalKPIs: KPI[] = [
          {
            name: "Budget Utilization",
            target: 85,
            actual: budgetUtilization,
            unit: "%",
            trend: budgetUtilization < 90 ? "neutral" : "up",
            status: budgetUtilization < 90 ? "success" : budgetUtilization < 95 ? "warning" : "danger"
          },
          {
            name: "On-time Payment Rate",
            target: 95,
            actual: onTimePaymentRate,
            unit: "%",
            trend: onTimePaymentRate > 90 ? "up" : "down",
            status: onTimePaymentRate > 90 ? "success" : onTimePaymentRate > 80 ? "warning" : "danger"
          },
          {
            name: "Document Processing",
            target: 50,
            actual: documents.length,
            unit: "",
            trend: "up",
            status: documents.length > 30 ? "success" : "warning"
          }
        ]

        const supplierKPIs: KPI[] = [
          {
            name: "Active Suppliers",
            target: 90,
            actual: supplierActiveRate,
            unit: "%",
            trend: supplierActiveRate > 85 ? "up" : "down",
            status: supplierActiveRate > 85 ? "success" : "warning"
          },          {
            name: "Total Suppliers",
            target: 20,
            actual: totalSuppliers,
            unit: "",
            trend: "up",
            status: totalSuppliers > 15 ? "success" : "warning"
          }
        ]

        setKpis({
          financial: financialKPIs,
          operational: operationalKPIs,
          suppliers: supplierKPIs
        })
      } catch (error) {
        console.error('Error fetching KPI data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Track your business KPIs against targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "danger":
        return "bg-red-500"
      default:
        return ""
    }
  }

  const getProgressValue = (kpi: KPI) => {
    // For metrics where lower is better (like expenses, CAC, etc.)
    const lowerIsBetter = [
      "Operating Expenses",
      "Customer Acquisition Cost",
      "Order Fulfillment Time",
      "Sales Cycle Length",
    ]

    if (lowerIsBetter.includes(kpi.name)) {
      // If target is 0, avoid division by zero
      if (kpi.target === 0) return 100

      // For lower is better, calculate how close we are to target
      // If actual is below target, we're doing better than target
      return kpi.actual <= kpi.target ? 100 : Math.max(0, 100 - ((kpi.actual - kpi.target) / kpi.target) * 100)
    }

    // For metrics where higher is better
    // If target is 0, avoid division by zero
    if (kpi.target === 0) return kpi.actual > 0 ? 100 : 0

    // Calculate percentage of target achieved
    return Math.min(100, (kpi.actual / kpi.target) * 100)
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === "$") {
      return `$${value.toLocaleString()}`
    } else if (unit === "%" || unit === "x") {
      return `${value.toFixed(1)}${unit}`
    } else if (unit === "days") {
      return `${value} days`
    } else {
      return value.toLocaleString()
    }
  }

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Track your business KPIs against targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
        <CardDescription>Track your business KPIs against targets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="financial">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {kpis.financial.map((kpi, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{kpi.name}</h3>
                      <Badge variant={kpi.status === 'success' ? 'default' : kpi.status === 'warning' ? 'secondary' : 'destructive'} className="flex items-center gap-1">
                        {kpi.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : kpi.trend === "down" ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {kpi.status}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>Target: {formatValue(kpi.target, kpi.unit)}</span>
                      <span>Actual: {formatValue(kpi.actual, kpi.unit)}</span>
                    </div>

                    <Progress
                      value={getProgressValue(kpi)}
                      className="h-2"
                      indicatorClassName={getProgressColor(kpi.status)}
                    />

                    <div className="mt-2 text-xs text-muted-foreground">
                      {getProgressValue(kpi).toFixed(0)}% of target
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="operational" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {kpis.operational.map((kpi, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{kpi.name}</h3>
                      <Badge variant={kpi.status === 'success' ? 'default' : kpi.status === 'warning' ? 'secondary' : 'destructive'} className="flex items-center gap-1">
                        {kpi.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : kpi.trend === "down" ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {kpi.status}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>Target: {formatValue(kpi.target, kpi.unit)}</span>
                      <span>Actual: {formatValue(kpi.actual, kpi.unit)}</span>
                    </div>

                    <Progress
                      value={getProgressValue(kpi)}
                      className="h-2"
                      indicatorClassName={getProgressColor(kpi.status)}
                    />

                    <div className="mt-2 text-xs text-muted-foreground">
                      {getProgressValue(kpi).toFixed(0)}% of target
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {kpis.suppliers.map((kpi, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{kpi.name}</h3>
                      <Badge variant={kpi.status === 'success' ? 'default' : kpi.status === 'warning' ? 'secondary' : 'destructive'} className="flex items-center gap-1">
                        {kpi.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : kpi.trend === "down" ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {kpi.status}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>Target: {formatValue(kpi.target, kpi.unit)}</span>
                      <span>Actual: {formatValue(kpi.actual, kpi.unit)}</span>
                    </div>

                    <Progress
                      value={getProgressValue(kpi)}
                      className="h-2"
                      indicatorClassName={getProgressColor(kpi.status)}
                    />

                    <div className="mt-2 text-xs text-muted-foreground">
                      {getProgressValue(kpi).toFixed(0)}% of target
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
