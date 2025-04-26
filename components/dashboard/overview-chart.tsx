"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    revenue: 4000,
    expenses: 2400,
  },
  {
    name: "Feb",
    revenue: 3000,
    expenses: 1398,
  },
  {
    name: "Mar",
    revenue: 2000,
    expenses: 9800,
  },
  {
    name: "Apr",
    revenue: 2780,
    expenses: 3908,
  },
  {
    name: "May",
    revenue: 1890,
    expenses: 4800,
  },
  {
    name: "Jun",
    revenue: 2390,
    expenses: 3800,
  },
  {
    name: "Jul",
    revenue: 3490,
    expenses: 4300,
  },
  {
    name: "Aug",
    revenue: 4000,
    expenses: 2400,
  },
  {
    name: "Sep",
    revenue: 3000,
    expenses: 1398,
  },
  {
    name: "Oct",
    revenue: 2000,
    expenses: 9800,
  },
  {
    name: "Nov",
    revenue: 2780,
    expenses: 3908,
  },
  {
    name: "Dec",
    revenue: 1890,
    expenses: 4800,
  },
]

export function OverviewChart() {
  const { theme } = useTheme()

  const textColor = theme === "dark" ? "#f8fafc" : "#0f172a"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={{ stroke: gridColor }} />
        <YAxis
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: gridColor }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
            borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
            color: textColor,
          }}
          formatter={(value) => [`$${value}`, undefined]}
        />
        <Legend />
        <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
