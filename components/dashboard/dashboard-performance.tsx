"use client"

import { useState, useEffect } from "react"
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
import { Invoice, Budget } from "@/lib/store"

interface PerformanceData {
  name: string
  revenue: number
  expenses: number
  profit: number
}

export function DashboardPerformance() {
  const { theme } = useTheme()
  const [chartType, setChartType] = useState<"area" | "bar">("area")
  const [data, setData] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesRes, budgetsRes] = await Promise.all([
          fetch('/api/invoices'),
          fetch('/api/budgets')
        ])

        const [invoices, budgets] = await Promise.all([
          invoicesRes.json(),
          budgetsRes.json()
        ])

        // Calculate monthly performance data
        const monthlyData: PerformanceData[] = []
        const currentDate = new Date()
        
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
          const monthName = date.toLocaleDateString('en', { month: 'short' })
          
          // Calculate revenue from paid invoices in this month
          const monthRevenue = invoices
            .filter((inv: Invoice) => {
              const invoiceDate = new Date(inv.issue_date)
              return invoiceDate.getMonth() === date.getMonth() && 
                     invoiceDate.getFullYear() === date.getFullYear() &&
                     inv.status === 'paid'
            })
            .reduce((sum: number, inv: Invoice) => sum + parseFloat(inv.amount.toString()), 0)

          // Calculate expenses from budgets spent in this month  
          const monthExpenses = budgets
            .filter((budget: Budget) => {
              const budgetDate = new Date(budget.created_at)
              return budgetDate.getMonth() === date.getMonth() && 
                     budgetDate.getFullYear() === date.getFullYear()
            })
            .reduce((sum: number, budget: Budget) => sum + parseFloat(budget.spent_amount.toString()), 0)

          const profit = monthRevenue - monthExpenses

          monthlyData.push({
            name: monthName,
            revenue: Math.round(monthRevenue),
            expenses: Math.round(monthExpenses), 
            profit: Math.round(profit)
          })
        }

        setData(monthlyData)
      } catch (error) {
        console.error('Error fetching performance data:', error)
        // Fallback to sample data if API fails
        setData([
          { name: "Jan", revenue: 15000, expenses: 10000, profit: 5000 },
          { name: "Feb", revenue: 18000, expenses: 12000, profit: 6000 },
          { name: "Mar", revenue: 19000, expenses: 11500, profit: 7500 },
          { name: "Apr", revenue: 22000, expenses: 13000, profit: 9000 },
          { name: "May", revenue: 20000, expenses: 14000, profit: 6000 },
          { name: "Jun", revenue: 25000, expenses: 15000, profit: 10000 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Theme colors
  const colors = {
    revenue: theme === "dark" ? "#60a5fa" : "#3b82f6",
    expenses: theme === "dark" ? "#f87171" : "#ef4444",
    profit: theme === "dark" ? "#4ade80" : "#22c55e",
    grid: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    text: theme === "dark" ? "#f8fafc" : "#334155",
  }

  const tooltipFormatter = (value: number) => [`$${value.toLocaleString()}`, undefined]

  if (loading) {
    return (
      <div className="h-[340px] pt-4 flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 rounded w-full h-full"></div>
      </div>
    )
  }

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
