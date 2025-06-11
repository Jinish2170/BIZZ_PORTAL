"use client"

import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/lib/store"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

interface DashboardChartsProps {
  type: "invoices" | "budget" | "suppliers"
}

export function DashboardCharts({ type }: DashboardChartsProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [invoicesRes, budgetsRes, suppliersRes] = await Promise.all([
          fetch('/api/invoices'),
          fetch('/api/budgets'),
          fetch('/api/suppliers')
        ])

        const [invoiceData, budgetData, supplierData] = await Promise.all([
          invoicesRes.json(),
          budgetsRes.json(),
          suppliersRes.json()
        ])

        setInvoices(invoiceData)
        setBudgets(budgetData)
        setSuppliers(supplierData)

        let data

        if (type === "invoices") {
          // Calculate invoice status totals
          const paid = invoiceData.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + parseFloat(i.amount), 0)
          const pending = invoiceData.filter((i: any) => i.status === "pending" || i.status === "unpaid").reduce((sum: number, i: any) => sum + parseFloat(i.amount), 0)
          const overdue = invoiceData.filter((i: any) => {
            const dueDate = new Date(i.due_date)
            return dueDate < new Date() && i.status === 'unpaid'
          }).reduce((sum: number, i: any) => sum + parseFloat(i.amount), 0)

          data = {
            labels: ["Paid", "Pending", "Overdue"],
            datasets: [
              {
                data: [paid, pending, overdue],
                backgroundColor: [
                  "rgba(34, 197, 94, 0.8)",
                  "rgba(234, 179, 8, 0.8)",
                  "rgba(239, 68, 68, 0.8)"
                ],
                borderColor: [
                  "rgba(34, 197, 94, 1)",
                  "rgba(234, 179, 8, 1)",
                  "rgba(239, 68, 68, 1)"
                ],
                borderWidth: 1,
              },
            ],
          }
        } else if (type === "budget") {
          // Budget allocation by department/category
          const budgetByCategory = budgetData.reduce((acc: any, budget: any) => {
            const category = budget.name || 'Other'
            const existingIndex = acc.findIndex((item: any) => item.category === category)
            
            if (existingIndex >= 0) {
              acc[existingIndex].amount += parseFloat(budget.total_amount)
            } else {
              acc.push({
                category,
                amount: parseFloat(budget.total_amount)
              })
            }
            return acc
          }, [])

          data = {
            labels: budgetByCategory.map((item: any) => item.category),
            datasets: [
              {
                label: "Budget Allocation",
                data: budgetByCategory.map((item: any) => item.amount),
                backgroundColor: [
                  "rgba(59, 130, 246, 0.8)",
                  "rgba(16, 185, 129, 0.8)",
                  "rgba(139, 92, 246, 0.8)",
                  "rgba(249, 115, 22, 0.8)",
                  "rgba(236, 72, 153, 0.8)",
                ],
                borderWidth: 0,
              },
            ],
          }
        } else if (type === "suppliers") {
          // Supplier statistics - active vs inactive
          const activeSuppliers = supplierData.filter((s: any) => s.status === 'active').length
          const inactiveSuppliers = supplierData.filter((s: any) => s.status === 'inactive').length

          data = {
            labels: ["Active", "Inactive"],
            datasets: [
              {
                label: "Suppliers",
                data: [activeSuppliers, inactiveSuppliers],
                backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
                borderColor: ["rgba(34, 197, 94, 1)", "rgba(239, 68, 68, 1)"],
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          }
        }

        setChartData(data)
      } catch (error) {
        console.error('Error fetching chart data:', error)      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === "suppliers" ? ("top" as const) : ("right" as const),
        display: type !== "invoices",
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || ""
            const value = context.raw || 0
            return type === "suppliers"
              ? `${label}: ${value} suppliers`
              : type === "invoices"
              ? `${context.label}: $${value.toLocaleString()} (${Math.round((value / context.chart.getDatasetMeta(0).total) * 100)}%)`
              : `${label}: $${value.toLocaleString()}`
          },
        },
      },
    },
    scales:
      type === "suppliers"
        ? {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value: any) => `${value}`,
                stepSize: 1,
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
          }
        : undefined,
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }
  return (
    <div className="h-full">
      {type === "invoices" && <Doughnut data={chartData} options={options} />}
      {type === "budget" && <Pie data={chartData} options={options} />}
      {type === "suppliers" && <Bar data={chartData} options={options} />}
    </div>
  )
}
