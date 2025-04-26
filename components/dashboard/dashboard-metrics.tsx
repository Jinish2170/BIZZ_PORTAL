"use client"

import { ArrowUpRight, ArrowDownRight, DollarSign, FileText, Users, Wallet } from "lucide-react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function DashboardMetrics() {
  const { suppliers, budgets, invoices, documents } = useStore()

  // Calculate key metrics
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalExpenses = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0)
  const totalProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  // Previous period metrics (for demo purposes)
  const prevRevenue = totalRevenue * 0.85
  const revenueChange = ((totalRevenue - prevRevenue) / prevRevenue) * 100

  const activeSuppliers = suppliers.filter((s) => s.status === "active").length
  const prevActiveSuppliers = Math.round(activeSuppliers * 0.9)
  const suppliersChange = ((activeSuppliers - prevActiveSuppliers) / prevActiveSuppliers) * 100

  const documentsCount = documents.length
  const prevDocumentsCount = Math.round(documentsCount * 0.8)
  const documentsChange = documentsCount > 0 ? ((documentsCount - prevDocumentsCount) / prevDocumentsCount) * 100 : 0

  const metrics = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: revenueChange,
      icon: DollarSign,
      trend: revenueChange >= 0 ? "up" : "down",
    },
    {
      title: "Active Suppliers",
      value: activeSuppliers.toString(),
      change: suppliersChange,
      icon: Users,
      trend: suppliersChange >= 0 ? "up" : "down",
    },
    {
      title: "Profit Margin",
      value: `${profitMargin.toFixed(1)}%`,
      change: 4.2, // Demo value
      icon: Wallet,
      trend: "up",
    },
    {
      title: "Documents",
      value: documentsCount.toString(),
      change: documentsChange,
      icon: FileText,
      trend: documentsChange >= 0 ? "up" : "down",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <div key={i} className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
              <p className="text-2xl font-bold mt-1">{metric.value}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2.5 text-primary">
              <metric.icon className="size-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className={cn("flex items-center mr-2", metric.trend === "up" ? "text-emerald-500" : "text-rose-500")}>
              {metric.trend === "up" ? (
                <ArrowUpRight className="mr-1 size-3.5" />
              ) : (
                <ArrowDownRight className="mr-1 size-3.5" />
              )}
              <span>{Math.abs(metric.change).toFixed(1)}%</span>
            </div>
            <span className="text-muted-foreground">from last month</span>
          </div>
        </div>
      ))}
    </div>
  )
}
