"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useTheme } from "next-themes"

// Sample data - in a real app, this would come from the store or API
const data = [
  { name: "Jan", revenue: 15000, expenses: 10000, profit: 5000 },
  { name: "Feb", revenue: 18000, expenses: 12000, profit: 6000 },
  { name: "Mar", revenue: 19000, expenses: 11500, profit: 7500 },
  { name: "Apr", revenue: 22000, expenses: 13000, profit: 9000 },
  { name: "May", revenue: 20000, expenses: 14000, profit: 6000 },
  { name: "Jun", revenue: 25000, expenses: 15000, profit: 10000 },
  { name: "Jul", revenue: 28000, expenses: 16000, profit: 12000 },
  { name: "Aug", revenue: 30000, expenses: 18000, profit: 12000 },
  { name: "Sep", revenue: 34000, expenses: 20000, profit: 14000 },
  { name: "Oct", revenue: 32000, expenses: 19000, profit: 13000 },
  { name: "Nov", revenue: 36000, expenses: 21000, profit: 15000 },
  { name: "Dec", revenue: 38000, expenses: 22000, profit: 16000 },
]

export function DashboardPerformance() {
  const { theme } = useTheme()
  const [chartType, setChartType] = useState<"area" | "bar">("area")

  // Theme colors
  const colors = {
    revenue: theme === "dark" ? "#60a5fa" : "#3b82f6",
    expenses: theme === "dark" ? "#f87171" : "#ef4444",
    profit: theme === "dark" ? "#4ade80" : "#22c55e",
    grid: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    text: theme === "dark" ? "#f8fafc" : "#334155",
  }

  const tooltipFormatter = (value: number) => [`$${value.toLocaleString()}`, undefined]

  return (
    <div className="h-[340px] pt-4">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "area" ? (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.revenue} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.revenue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.expenses} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.expenses} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.profit} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.profit} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: colors.text }} />
            <YAxis
              tick={{ fill: colors.text }}
              tickFormatter={(value) => `$${value >= 1000 ? `${value / 1000}k` : value}`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke={colors.revenue} fillOpacity={1} fill="url(#colorRevenue)" />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={colors.expenses}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
            <Area type="monotone" dataKey="profit" stroke={colors.profit} fillOpacity={1} fill="url(#colorProfit)" />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis dataKey="name" tick={{ fill: colors.text }} />
            <YAxis
              tick={{ fill: colors.text }}
              tickFormatter={(value) => `$${value >= 1000 ? `${value / 1000}k` : value}`}
            />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Bar dataKey="revenue" fill={colors.revenue} name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill={colors.expenses} name="Expenses" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill={colors.profit} name="Profit" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
