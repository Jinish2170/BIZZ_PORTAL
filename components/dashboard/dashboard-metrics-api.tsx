"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownRight, DollarSign, FileText, Users, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { Budget, Invoice, Supplier, Document } from "@/lib/store"

export function DashboardMetrics() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, budgetsRes, invoicesRes, documentsRes] = await Promise.all([
          fetch('/api/suppliers'),
          fetch('/api/budgets'),
          fetch('/api/invoices'),
          fetch('/api/documents')
        ])

        const [suppliersData, budgetsData, invoicesData, documentsData] = await Promise.all([
          suppliersRes.json(),
          budgetsRes.json(),
          invoicesRes.json(),
          documentsRes.json()
        ])

        setSuppliers(suppliersData)
        setBudgets(budgetsData)
        setInvoices(invoicesData)
        setDocuments(documentsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }
  // Calculate key metrics
  const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0)
  const totalExpenses = budgets.reduce((sum, budget) => sum + parseFloat(budget.spent_amount.toString()), 0)
  const totalProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  // Previous period metrics (for demo purposes)
  const prevRevenue = totalRevenue * 0.85
  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

  const activeSuppliers = suppliers.filter((s) => s.status === "active").length
  const prevActiveSuppliers = Math.round(activeSuppliers * 0.9)
  const suppliersChange = prevActiveSuppliers > 0 ? ((activeSuppliers - prevActiveSuppliers) / prevActiveSuppliers) * 100 : 0

  const documentsCount = documents.length
  const prevDocumentsCount = Math.round(documentsCount * 0.8)
  const documentsChange = prevDocumentsCount > 0 ? ((documentsCount - prevDocumentsCount) / prevDocumentsCount) * 100 : 0

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
      {metrics.map((metric) => {
        const Icon = metric.icon
        const isPositive = metric.change >= 0
        return (
          <div
            key={metric.title}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
          >
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">{metric.title}</p>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {isPositive ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span className={cn(isPositive ? "text-green-500" : "text-red-500")}>
                  {Math.abs(metric.change).toFixed(1)}%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
