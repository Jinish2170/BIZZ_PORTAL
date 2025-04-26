"use client"

import { useStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"

export function DashboardBudgetSummary() {
  const { budgets } = useStore()

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.totalAmount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0)
  const totalRemainingPercentage = totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0

  // Group budgets by department
  const departmentTotals = budgets.reduce(
    (acc, budget) => {
      if (!acc[budget.department]) {
        acc[budget.department] = {
          total: 0,
          spent: 0,
        }
      }

      acc[budget.department].total += budget.totalAmount
      acc[budget.department].spent += budget.spentAmount

      return acc
    },
    {} as Record<string, { total: number; spent: number }>,
  )

  // Convert to array for rendering
  const departments = Object.entries(departmentTotals)
    .map(([department, { total, spent }]) => ({
      department,
      total,
      spent,
      remaining: total - spent,
      percentageSpent: (spent / total) * 100,
    }))
    .sort((a, b) => b.total - a.total)

  const getProgressColor = (percentageSpent: number) => {
    if (percentageSpent < 50) return "bg-emerald-500"
    if (percentageSpent < 75) return "bg-amber-500"
    return "bg-rose-500"
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Budget</span>
          <span className="text-sm text-muted-foreground">
            ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
          </span>
        </div>
        <div className="space-y-1">
          <Progress value={100 - totalRemainingPercentage} className="h-2" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{totalRemainingPercentage.toFixed(0)}% remaining</span>
            <span className="font-medium">${(totalBudget - totalSpent).toLocaleString()} left</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Department Breakdown</h4>

        {departments.map((dept) => (
          <div key={dept.department} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{dept.department}</span>
              <span className="text-xs text-muted-foreground">
                ${dept.spent.toLocaleString()} of ${dept.total.toLocaleString()}
              </span>
            </div>
            <Progress
              value={dept.percentageSpent}
              className="h-1.5"
              indicatorClassName={getProgressColor(dept.percentageSpent)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
