"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Sample data - in a real app, this would come from an API or store
const cashFlowData = [
  { month: "Jan", inflow: 42000, outflow: 35000, netFlow: 7000 },
  { month: "Feb", inflow: 45000, outflow: 38000, netFlow: 7000 },
  { month: "Mar", inflow: 48000, outflow: 37000, netFlow: 11000 },
  { month: "Apr", inflow: 51000, outflow: 41000, netFlow: 10000 },
  { month: "May", inflow: 53000, outflow: 44000, netFlow: 9000 },
  { month: "Jun", inflow: 56000, outflow: 45000, netFlow: 11000 },
  { month: "Jul", inflow: 58000, outflow: 47000, netFlow: 11000 },
  { month: "Aug", inflow: 60000, outflow: 48000, netFlow: 12000 },
  { month: "Sep", inflow: 62000, outflow: 50000, netFlow: 12000 },
  { month: "Oct", inflow: 64000, outflow: 51000, netFlow: 13000 },
  { month: "Nov", inflow: 66000, outflow: 53000, netFlow: 13000 },
  { month: "Dec", inflow: 68000, outflow: 54000, netFlow: 14000 },
]

// Projected data for the next 6 months
const projectedData = [
  { month: "Jan", projected: 15000, actual: 14000 },
  { month: "Feb", projected: 16000, actual: 15000 },
  { month: "Mar", projected: 17000, actual: 18000 },
  { month: "Apr", projected: 18000, actual: 17000 },
  { month: "May", projected: 19000, actual: 20000 },
  { month: "Jun", projected: 20000, actual: 19000 },
  { month: "Jul", projected: 21000, actual: null },
  { month: "Aug", projected: 22000, actual: null },
  { month: "Sep", projected: 23000, actual: null },
  { month: "Oct", projected: 24000, actual: null },
  { month: "Nov", projected: 25000, actual: null },
  { month: "Dec", projected: 26000, actual: null },
]

export function CashFlowTrends() {
  const { theme } = useTheme()

  // Theme colors
  const colors = {
    inflow: theme === "dark" ? "#4ade80" : "#22c55e", // Green
    outflow: theme === "dark" ? "#f87171" : "#ef4444", // Red
    netFlow: theme === "dark" ? "#60a5fa" : "#3b82f6", // Blue
    projected: theme === "dark" ? "#c084fc" : "#a855f7", // Purple
    grid: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    text: theme === "dark" ? "#f8fafc" : "#334155",
  }

  const tooltipFormatter = (value: number) => [`$${value.toLocaleString()}`, undefined]

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Cash Flow Trends</CardTitle>
        <CardDescription>Monthly cash inflows and outflows with net cash flow</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inflow-outflow">Inflow vs Outflow</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNetFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.netFlow} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.netFlow} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: colors.text }} />
                <YAxis
                  tick={{ fill: colors.text }}
                  tickFormatter={(value) => `$${value >= 1000 ? `${value / 1000}k` : value}`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="netFlow"
                  stroke={colors.netFlow}
                  fillOpacity={1}
                  fill="url(#colorNetFlow)"
                  name="Net Cash Flow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="inflow-outflow" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="month" tick={{ fill: colors.text }} />
                <YAxis
                  tick={{ fill: colors.text }}
                  tickFormatter={(value) => `$${value >= 1000 ? `${value / 1000}k` : value}`}
                />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Bar dataKey="inflow" fill={colors.inflow} name="Cash Inflow" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill={colors.outflow} name="Cash Outflow" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="projections" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="month" tick={{ fill: colors.text }} />
                <YAxis
                  tick={{ fill: colors.text }}
                  tickFormatter={(value) => `$${value >= 1000 ? `${value / 1000}k` : value}`}
                />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke={colors.projected}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Projected Cash Flow"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke={colors.netFlow}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Actual Cash Flow"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
