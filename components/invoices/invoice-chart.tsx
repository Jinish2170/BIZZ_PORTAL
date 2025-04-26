"use client"

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

interface InvoiceChartProps {
  type: "bar" | "line" | "pie"
  data: {
    labels: string[]
    values?: number[]
    datasets?: {
      label: string
      values: number[]
    }[]
  }
}

export function InvoiceChart({ type, data }: InvoiceChartProps) {
  const colors = {
    primary: "rgba(53, 162, 235, 0.8)",
    primaryLight: "rgba(53, 162, 235, 0.5)",
    secondary: "rgba(255, 99, 132, 0.8)",
    secondaryLight: "rgba(255, 99, 132, 0.5)",
    success: "rgba(75, 192, 192, 0.8)",
    successLight: "rgba(75, 192, 192, 0.5)",
    warning: "rgba(255, 206, 86, 0.8)",
    warningLight: "rgba(255, 206, 86, 0.5)",
    danger: "rgba(255, 99, 132, 0.8)",
    dangerLight: "rgba(255, 99, 132, 0.5)",
  }

  const pieColors = [colors.success, colors.warning, colors.danger, "rgba(153, 102, 255, 0.8)"]

  const pieData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: pieColors,
        borderColor: pieColors.map((color) => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  }

  const barData = {
    labels: data.labels,
    datasets: [
      {
        label: "Amount",
        data: data.values,
        backgroundColor: colors.primary,
        borderColor: colors.primary.replace("0.8", "1"),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const lineData = {
    labels: data.labels,
    datasets: data.datasets?.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.values,
      borderColor: index === 0 ? colors.primary.replace("0.8", "1") : colors.secondary.replace("0.8", "1"),
      backgroundColor: index === 0 ? colors.primaryLight : colors.secondaryLight,
      tension: 0.4,
      fill: true,
    })),
  }

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

  return (
    <div className="h-full">
      {type === "bar" && <Bar data={barData} options={options} />}
      {type === "line" && <Line data={lineData} options={options} />}
      {type === "pie" && <Pie data={pieData} options={options} />}
    </div>
  )
}
