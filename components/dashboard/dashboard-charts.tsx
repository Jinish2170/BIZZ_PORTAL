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
  type: "financial" | "invoices" | "budget" | "suppliers"
}

export function DashboardCharts({ type }: DashboardChartsProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { invoices } = useStore()

  useEffect(() => {
    // Simulate data loading
    setLoading(true)

    setTimeout(() => {
      let data

      if (type === "financial") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

        data = {
          labels: months,
          datasets: [
            {
              label: "Revenue",
              data: [95000, 100000, 110000, 115000, 120000, 125000],
              borderColor: "rgba(59, 130, 246, 1)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Expenses",
              data: [65000, 68000, 72000, 75000, 80000, 85000],
              borderColor: "rgba(239, 68, 68, 1)",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Profit",
              data: [30000, 32000, 38000, 40000, 40000, 40000],
              borderColor: "rgba(34, 197, 94, 1)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        }
      } else if (type === "invoices") {
        // Calculate invoice status totals
        const paid = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
        const pending = invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)
        const overdue = invoices.filter((i) => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)
        const draft = invoices.filter((i) => i.status === "draft").reduce((sum, i) => sum + i.amount, 0)

        data = {
          labels: ["Paid", "Pending", "Overdue", "Draft"],
          datasets: [
            {
              data: [paid, pending, overdue, draft],
              backgroundColor: [
                "rgba(34, 197, 94, 0.8)",
                "rgba(234, 179, 8, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(107, 114, 128, 0.8)",
              ],
              borderColor: [
                "rgba(34, 197, 94, 1)",
                "rgba(234, 179, 8, 1)",
                "rgba(239, 68, 68, 1)",
                "rgba(107, 114, 128, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }
      } else if (type === "budget") {
        data = {
          labels: ["Marketing", "Operations", "IT", "HR", "R&D"],
          datasets: [
            {
              label: "Budget Allocation",
              data: [25000, 35000, 20000, 10000, 10000],
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
        data = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "New Suppliers",
              data: [3, 5, 2, 4, 6, 3],
              backgroundColor: "rgba(59, 130, 246, 0.8)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        }
      }

      setChartData(data)
      setLoading(false)
    }, 500)
  }, [type, invoices])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === "financial" ? ("top" as const) : ("right" as const),
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
            return type !== "invoices"
              ? `${label}: $${value.toLocaleString()}`
              : `${context.label}: $${value.toLocaleString()} (${Math.round((value / context.chart.getDatasetMeta(0).total) * 100)}%)`
          },
        },
      },
    },
    scales:
      type === "financial" || type === "suppliers"
        ? {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value: any) => `$${value.toLocaleString()}`,
                stepSize: 20000,
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
      {type === "financial" && <Line data={chartData} options={options} />}
      {type === "invoices" && <Doughnut data={chartData} options={options} />}
      {type === "budget" && <Pie data={chartData} options={options} />}
      {type === "suppliers" && <Bar data={chartData} options={options} />}
    </div>
  )
}
