"use client"

import { useState, useEffect } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import { Skeleton } from "@/components/ui/skeleton"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ComparisonChartProps {
  metrics: any[]
  comparisonPeriod: string
}

export function ComparisonChart({ metrics, comparisonPeriod }: ComparisonChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    setLoading(true)

    setTimeout(() => {
      let data

      // Financial metrics to compare
      const metricNames = ["Revenue", "Expenses", "Profit", "Marketing", "Operations", "R&D"]

      if (comparisonPeriod === "previous_year") {
        data = {
          labels: metricNames,
          datasets: [
            {
              label: "Current Year",
              data: [125000, 85000, 40000, 15000, 35000, 10000],
              backgroundColor: "rgba(53, 162, 235, 0.7)",
            },
            {
              label: "Previous Year",
              data: [110000, 78000, 32000, 12000, 32000, 8000],
              backgroundColor: "rgba(53, 162, 235, 0.3)",
            },
          ],
        }
      } else if (comparisonPeriod === "budget") {
        data = {
          labels: metricNames,
          datasets: [
            {
              label: "Actual",
              data: [125000, 85000, 40000, 15000, 35000, 10000],
              backgroundColor: "rgba(53, 162, 235, 0.7)",
            },
            {
              label: "Budget",
              data: [120000, 80000, 40000, 18000, 32000, 12000],
              backgroundColor: "rgba(255, 99, 132, 0.7)",
            },
          ],
        }
      } else if (comparisonPeriod === "forecast") {
        data = {
          labels: metricNames,
          datasets: [
            {
              label: "Actual",
              data: [125000, 85000, 40000, 15000, 35000, 10000],
              backgroundColor: "rgba(53, 162, 235, 0.7)",
            },
            {
              label: "Forecast",
              data: [130000, 88000, 42000, 16000, 36000, 11000],
              backgroundColor: "rgba(75, 192, 192, 0.7)",
            },
          ],
        }
      } else {
        // Default to previous period
        data = {
          labels: metricNames,
          datasets: [
            {
              label: "Current Period",
              data: [125000, 85000, 40000, 15000, 35000, 10000],
              backgroundColor: "rgba(53, 162, 235, 0.7)",
            },
            {
              label: "Previous Period",
              data: [110000, 78000, 32000, 14000, 30000, 9000],
              backgroundColor: "rgba(53, 162, 235, 0.3)",
            },
          ],
        }
      }

      setChartData(data)
      setLoading(false)
    }, 1000)
  }, [comparisonPeriod])

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
            return `${label}: $${value.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => "$" + value.toLocaleString(),
        },
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
      <Bar data={chartData} options={options} />
    </div>
  )
}
