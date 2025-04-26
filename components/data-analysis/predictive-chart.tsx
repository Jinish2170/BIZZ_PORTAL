"use client"

import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Skeleton } from "@/components/ui/skeleton"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface PredictiveChartProps {
  metrics: any[]
  category: string
  periods: number
}

export function PredictiveChart({ metrics, category, periods = 6 }: PredictiveChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading and prediction calculation
    setLoading(true)

    setTimeout(() => {
      // Historical data (past 6 months)
      const historicalMonths = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]

      // Future months for prediction
      const futureMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]

      // Combined labels
      const labels = [...historicalMonths, ...futureMonths.slice(0, periods)]

      let historicalData: number[] = []
      let predictedData: number[] = []
      let confidenceUpperBound: number[] = []
      let confidenceLowerBound: number[] = []

      if (category === "revenue") {
        historicalData = [90000, 95000, 105000, 110000, 115000, 125000]

        // Simple linear regression for prediction (in a real app, this would be more sophisticated)
        predictedData = [130000, 135000, 140000, 145000, 150000, 155000]

        // Confidence intervals
        confidenceUpperBound = predictedData.map((val) => val * 1.1) // 10% above prediction
        confidenceLowerBound = predictedData.map((val) => val * 0.9) // 10% below prediction
      } else if (category === "expenses") {
        historicalData = [65000, 68000, 72000, 75000, 80000, 85000]

        // Simple linear regression for prediction
        predictedData = [88000, 91000, 94000, 97000, 100000, 103000]

        // Confidence intervals
        confidenceUpperBound = predictedData.map((val) => val * 1.08) // 8% above prediction
        confidenceLowerBound = predictedData.map((val) => val * 0.92) // 8% below prediction
      } else if (category === "profit") {
        historicalData = [25000, 27000, 33000, 35000, 35000, 40000]

        // Simple linear regression for prediction
        predictedData = [42000, 44000, 46000, 48000, 50000, 52000]

        // Confidence intervals
        confidenceUpperBound = predictedData.map((val) => val * 1.15) // 15% above prediction
        confidenceLowerBound = predictedData.map((val) => val * 0.85) // 15% below prediction
      }

      // Create datasets for the chart
      const data = {
        labels,
        datasets: [
          {
            label: "Historical Data",
            data: [...historicalData, ...Array(periods).fill(null)],
            borderColor: "rgba(53, 162, 235, 1)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 2,
          },
          {
            label: "Predicted",
            data: [...Array(historicalData.length).fill(null), ...predictedData],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 2,
          },
          {
            label: "Upper Bound",
            data: [...Array(historicalData.length).fill(null), ...confidenceUpperBound],
            borderColor: "rgba(255, 99, 132, 0.3)",
            backgroundColor: "transparent",
            borderDash: [2, 2],
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 1,
          },
          {
            label: "Lower Bound",
            data: [...Array(historicalData.length).fill(null), ...confidenceLowerBound],
            borderColor: "rgba(255, 99, 132, 0.3)",
            backgroundColor: "rgba(255, 99, 132, 0.1)",
            borderDash: [2, 2],
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 1,
            fill: {
              target: "+1",
              above: "rgba(255, 99, 132, 0.1)",
            },
          },
        ],
      }

      setChartData(data)
      setLoading(false)
    }, 1000)
  }, [category, periods])

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
            if (value === null) return label
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
      x: {
        grid: {
          color: (context: any) => {
            // Add a vertical line to separate historical from predicted data
            return context.index === 5 ? "rgba(255, 99, 132, 0.2)" : "rgba(0, 0, 0, 0.1)"
          },
          lineWidth: (context: any) => {
            return context.index === 5 ? 2 : 1
          },
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
      <Line data={chartData} options={options} />
    </div>
  )
}
