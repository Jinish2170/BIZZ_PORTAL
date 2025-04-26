"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

// Sample KPI data - in a real app, this would come from an API or store
const kpis = {
  financial: [
    {
      name: "Revenue Growth",
      target: 15,
      actual: 13.64,
      unit: "%",
      trend: "up",
      status: "warning", // warning because below target
    },
    {
      name: "Profit Margin",
      target: 30,
      actual: 32,
      unit: "%",
      trend: "up",
      status: "success", // success because above target
    },
    {
      name: "Operating Expenses",
      target: 70000,
      actual: 68000,
      unit: "$",
      trend: "down",
      status: "success", // success because below target (for expenses, lower is better)
    },
    {
      name: "Cash Flow",
      target: 50000,
      actual: 45000,
      unit: "$",
      trend: "down",
      status: "warning", // warning because below target
    },
  ],
  marketing: [
    {
      name: "Customer Acquisition Cost",
      target: 200,
      actual: 250,
      unit: "$",
      trend: "up",
      status: "danger", // danger because above target (for CAC, lower is better)
    },
    {
      name: "Marketing ROI",
      target: 3.5,
      actual: 3.2,
      unit: "x",
      trend: "up",
      status: "warning", // warning because below target
    },
    {
      name: "Conversion Rate",
      target: 3.5,
      actual: 3.8,
      unit: "%",
      trend: "up",
      status: "success", // success because above target
    },
    {
      name: "Social Media Engagement",
      target: 15000,
      actual: 16200,
      unit: "",
      trend: "up",
      status: "success", // success because above target
    },
  ],
  operations: [
    {
      name: "Inventory Turnover",
      target: 6,
      actual: 5.8,
      unit: "x",
      trend: "up",
      status: "warning", // warning because below target
    },
    {
      name: "Order Fulfillment Time",
      target: 2,
      actual: 1.8,
      unit: "days",
      trend: "down",
      status: "success", // success because below target (for time, lower is better)
    },
    {
      name: "Supplier On-Time Delivery",
      target: 95,
      actual: 92,
      unit: "%",
      trend: "down",
      status: "warning", // warning because below target
    },
    {
      name: "Quality Control Pass Rate",
      target: 98,
      actual: 99.2,
      unit: "%",
      trend: "up",
      status: "success", // success because above target
    },
  ],
  sales: [
    {
      name: "Sales Growth",
      target: 12,
      actual: 14.5,
      unit: "%",
      trend: "up",
      status: "success", // success because above target
    },
    {
      name: "Average Order Value",
      target: 1200,
      actual: 1250,
      unit: "$",
      trend: "up",
      status: "success", // success because above target
    },
    {
      name: "Customer Retention Rate",
      target: 85,
      actual: 82,
      unit: "%",
      trend: "down",
      status: "warning", // warning because below target
    },
    {
      name: "Sales Cycle Length",
      target: 30,
      actual: 32,
      unit: "days",
      trend: "up",
      status: "warning", // warning because above target (for cycle length, lower is better)
    },
  ],
}

export function KeyPerformanceIndicators() {
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

  const getProgressValue = (kpi: any) => {
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
      return `${value}${unit}`
    } else if (unit === "days") {
      return `${value} days`
    } else {
      return value.toLocaleString()
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
        <CardDescription>Track your business KPIs against targets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="financial">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>

          {Object.entries(kpis).map(([category, categoryKpis]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {categoryKpis.map((kpi, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{kpi.name}</h3>
                        <Badge variant={kpi.status as any} className="flex items-center gap-1">
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
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
