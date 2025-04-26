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
import { Bar, Line, Pie } from "react-chartjs-2"
import { Skeleton } from "@/components/ui/skeleton"

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

interface AdvancedChartProps {
  type: string
  metrics: any[]
  comparisonPeriod: string
  category?: string
}

export function AdvancedChart({ type = "bar", metrics, comparisonPeriod, category }: AdvancedChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    setLoading(true)

    setTimeout(() => {
      let data

      if (category === "revenue") {
        // Revenue by category data
        data = {
          labels: ["Product Sales", "Services", "Subscriptions", "Licensing", "Other"],
          datasets: [
            {
              label: "Revenue",
              data: [45000, 30000, 25000, 15000, 10000],
              backgroundColor: [
                "rgba(53, 162, 235, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(255, 99, 132, 0.8)",
                "rgba(153, 102, 255, 0.8)",
              ],
              borderColor: [
                "rgba(53, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }
      } else if (category === "expenses") {
        // Expenses by category data
        data = {
          labels: ["Salaries", "Marketing", "Operations", "Supplies", "Software", "Other"],
          datasets: [
            {
              label: "Expenses",
              data: [35000, 15000, 12000, 8000, 10000, 5000],
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(255, 159, 64, 0.8)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }
      } else {
        // Financial performance data
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

        if (comparisonPeriod === "previous_year") {
          data = {
            labels: months,
            datasets: [
              {
                label: "Revenue (Current Year)",
                data: [95000, 100000, 110000, 115000, 120000, 125000],
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                borderColor: "rgba(53, 162, 235, 1)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Revenue (Previous Year)",
                data: [85000, 90000, 95000, 100000, 105000, 110000],
                backgroundColor: "rgba(53, 162, 235, 0.2)",
                borderColor: "rgba(53, 162, 235, 0.5)",
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
              },
              {
                label: "Expenses (Current Year)",
                data: [65000, 68000, 72000, 75000, 80000, 85000],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Expenses (Previous Year)",
                data: [60000, 62000, 65000, 68000, 72000, 78000],
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 0.5)",
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
              },
            ],
          }
        } else if (comparisonPeriod === "budget") {
          data = {
            labels: months,
            datasets: [
              {
                label: "Actual Revenue",
                data: [95000, 100000, 110000, 115000, 120000, 125000],
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                borderColor: "rgba(53, 162, 235, 1)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Budgeted Revenue",
                data: [90000, 95000, 105000, 110000, 115000, 120000],
                backgroundColor: "rgba(53, 162, 235, 0.2)",
                borderColor: "rgba(53, 162, 235, 0.5)",
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
              },
              {
                label: "Actual Expenses",
                data: [65000, 68000, 72000, 75000, 80000, 85000],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Budgeted Expenses",
                data: [70000, 72000, 75000, 78000, 82000, 85000],
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 0.5)",
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
              },
            ],
          }
        } else if (comparisonPeriod === "forecast") {
          data = {
            labels: months,
            datasets: [
              {
                label: "Actual Revenue",
                data: [95000, 100000, 110000, 115000, 120000, 125000],
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                borderColor: "rgba(53, 162, 235, 1)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Forecasted Revenue",
                data: [92000, 98000, 108000, 118000, 125000, 130000],
                backgroundColor: "rgba(53, 162, 235, 0.2)",
                borderColor: "rgba(53, 162, 235, 0.5)",
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
              },
              {
                label: "Actual Expenses",
                data: [65000, 68000, 72000, 75000, 80000, 85000],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Forecasted Expenses",
                data: [68000, 70000, 74000, 78000, 83000, 88000],
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 0.5)",
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
              },
            ],
          }
        } else {
          // Default to previous period
          data = {
            labels: months,
            datasets: [
              {
                label: "Revenue",
                data: [95000, 100000, 110000, 115000, 120000, 125000],
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                borderColor: "rgba(53, 162, 235, 1)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Expenses",
                data: [65000, 68000, 72000, 75000, 80000, 85000],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Profit",
                data: [30000, 32000, 38000, 40000, 40000, 40000],
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                tension: 0.4,
              },
            ],
          }
        }
      }

      setChartData(data)
      setLoading(false)
    }, 1000)
  }, [type, comparisonPeriod, category])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || ""
            const value = context.raw || 0
            return type !== "pie"
              ? `${label}: $${value.toLocaleString()}`
              : `${context.label}: $${value.toLocaleString()} (${Math.round((value / context.chart.getDatasetMeta(0).total) * 100)}%)`
          },
        },
      },
    },
    scales:
      type !== "pie"
        ? {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value: any) => "$" + value.toLocaleString(),
              },
            },
          }
        : undefined,
    animation: {
      duration: 1000,
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      {type === "bar" && <Bar data={chartData} options={options} />}
      {type === "line" && <Line data={chartData} options={options} />}
      {type === "pie" && <Pie data={chartData} options={options} />}
    </div>
  )
}
