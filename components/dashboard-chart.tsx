"use client"

import { useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Bar, Pie } from "react-chartjs-2"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface DashboardChartProps {
  type: "bar" | "pie"
}

export default function DashboardChart({ type }: DashboardChartProps) {
  const [timeRange, setTimeRange] = useState("month")

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
        },
      },
      title: {
        display: false,
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
          label: (context: any) => `Score: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
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

  const barData = {
    labels: ["Supplier A", "Supplier B", "Supplier C", "Supplier D", "Supplier E"],
    datasets: [
      {
        label: "Performance Score",
        data:
          timeRange === "month"
            ? [85, 72, 90, 65, 78]
            : timeRange === "quarter"
              ? [82, 75, 88, 70, 80]
              : [80, 78, 85, 75, 82],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "rgba(59, 130, 246, 0.9)",
      },
    ],
  }

  const pieData = {
    labels: ["Marketing", "Operations", "IT", "HR", "R&D"],
    datasets: [
      {
        label: "Budget Allocation",
        data:
          timeRange === "month"
            ? [25000, 35000, 20000, 10000, 10000]
            : timeRange === "quarter"
              ? [30000, 32000, 18000, 12000, 8000]
              : [28000, 34000, 22000, 9000, 7000],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
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
            const label = context.label || ""
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: ${value.toLocaleString()} (${percentage}%)`
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4 flex justify-end">
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="w-full h-[calc(100%-40px)] flex items-center justify-center">
        {type === "bar" ? <Bar options={barOptions} data={barData} /> : <Pie data={pieData} options={pieOptions} />}
      </div>
    </div>
  )
}
