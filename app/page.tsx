import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { DashboardPerformance } from "@/components/dashboard/dashboard-performance"
import { DashboardTasks } from "@/components/dashboard/dashboard-tasks"
import { DashboardUpcomingPayments } from "@/components/dashboard/dashboard-upcoming-payments"
import { DashboardBudgetSummary } from "@/components/dashboard/dashboard-budget-summary"
import { DashboardSupplierStats } from "@/components/dashboard/dashboard-supplier-stats"
import { ArrowRight } from "lucide-react"
import { CashFlowTrends } from "@/components/dashboard/cash-flow-trends"
import { KeyPerformanceIndicators } from "@/components/dashboard/key-performance-indicators"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to BizzPortal, your business management platform</p>
      </div>

      <DashboardMetrics />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Business Performance</CardTitle>
                  <CardDescription>Monthly revenue and expenses overview</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Monthly
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-2">
                <DashboardPerformance />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and changes</CardDescription>
              </CardHeader>
              <CardContent className="h-[340px] overflow-hidden">
                <RecentActivity />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Tasks & Reminders</CardTitle>
                <CardDescription>Your pending tasks</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] overflow-auto">
                <DashboardTasks />
              </CardContent>
            </Card>

            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>Next 7 days invoice due dates</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <DashboardUpcomingPayments />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Business metrics trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">{/* KPI Chart Component */}</CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Supplier Statistics</CardTitle>
                <CardDescription>Performance across suppliers</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <DashboardSupplierStats />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finances" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Cash Flow Trends</CardTitle>
                <CardDescription>Revenue and expenses analysis</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">{/* Cash Flow Chart Component */}</CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
                <CardDescription>Budget allocation and spending</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <DashboardBudgetSummary />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <CashFlowTrends />
      <div className="h-4"></div>
      <KeyPerformanceIndicators />
    </div>
  )
}
