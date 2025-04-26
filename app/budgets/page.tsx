"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Download, Filter, MoreHorizontal, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { FormField } from "@/components/form-validation"
import { z } from "zod"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useStore, type Budget } from "@/lib/store"
import {
  PageContainer,
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
  PageContent,
} from "@/components/layout/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BudgetsPage() {
  const { toast } = useToast()
  const { budgets, addBudget, updateBudget, deleteBudget } = useStore()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    totalAmount: 0,
    spentAmount: 0,
    department: "Marketing",
  })

  // Validation schemas
  const nameSchema = z.string().min(3, "Name must be at least 3 characters")
  const amountSchema = z.number().min(0, "Amount must be a positive number")

  const handleAddBudget = () => {
    addBudget(formData)
    setFormData({ name: "", totalAmount: 0, spentAmount: 0, department: "Marketing" })
    setIsAddDialogOpen(false)

    toast({
      title: "Budget added",
      description: "The budget has been added successfully.",
    })
  }

  const handleEditBudget = () => {
    if (!currentBudget) return

    updateBudget(currentBudget.id, formData)
    setFormData({ name: "", totalAmount: 0, spentAmount: 0, department: "Marketing" })
    setIsEditDialogOpen(false)
    setCurrentBudget(null)

    toast({
      title: "Budget updated",
      description: "The budget has been updated successfully.",
    })
  }

  const handleDeleteBudget = (id: string) => {
    deleteBudget(id)

    toast({
      title: "Budget deleted",
      description: "The budget has been deleted successfully.",
    })
  }

  const openEditDialog = (budget: Budget) => {
    setCurrentBudget(budget)
    setFormData({
      name: budget.name,
      totalAmount: budget.totalAmount,
      spentAmount: budget.spentAmount,
      department: budget.department,
    })
    setIsEditDialogOpen(true)
  }

  const calculateProgress = (spent: number, total: number) => {
    return Math.min(Math.round((spent / total) * 100), 100)
  }

  const getBudgetStatus = (spent: number, total: number) => {
    const percentage = (spent / total) * 100
    if (percentage < 50) return "success"
    if (percentage < 75) return "warning"
    return "destructive"
  }

  const columns: ColumnDef<Budget>[] = [
    {
      accessorKey: "name",
      header: "Budget Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.getValue("department")}
        </Badge>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => <div>${(row.getValue("totalAmount") as number).toLocaleString()}</div>,
    },
    {
      accessorKey: "spentAmount",
      header: "Spent Amount",
      cell: ({ row }) => <div>${(row.getValue("spentAmount") as number).toLocaleString()}</div>,
    },
    {
      id: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const total = row.getValue("totalAmount") as number
        const spent = row.getValue("spentAmount") as number
        const progress = calculateProgress(spent, total)
        const status = getBudgetStatus(spent, total)

        return (
          <div className="w-full max-w-[180px]">
            <div className="flex items-center gap-2">
              <Progress
                value={progress}
                className="h-2"
                indicatorClassName={
                  status === "success" ? "bg-green-500" : status === "warning" ? "bg-yellow-500" : "bg-red-500"
                }
              />
              <span className="text-xs text-muted-foreground w-9">{progress}%</span>
            </div>
          </div>
        )
      },
    },
    {
      id: "remaining",
      header: "Remaining",
      cell: ({ row }) => {
        const total = row.getValue("totalAmount") as number
        const spent = row.getValue("spentAmount") as number
        const remaining = total - spent

        return <div className="font-medium">${remaining.toLocaleString()}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const budget = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditDialog(budget)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this budget? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteBudget(budget.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Calculate summary statistics
  const totalBudgetAmount = budgets.reduce((sum, budget) => sum + budget.totalAmount, 0)
  const totalSpentAmount = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0)
  const totalRemainingAmount = totalBudgetAmount - totalSpentAmount
  const overallProgress = totalBudgetAmount > 0 ? Math.round((totalSpentAmount / totalBudgetAmount) * 100) : 0

  // Group budgets by department
  const budgetsByDepartment = budgets.reduce(
    (acc, budget) => {
      acc[budget.department] = (acc[budget.department] || 0) + budget.totalAmount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageHeaderHeading>Budgets</PageHeaderHeading>
          <PageHeaderDescription>Manage your budget allocations and track spending</PageHeaderDescription>
        </div>
        <PageActions>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Budget</DialogTitle>
                <DialogDescription>Add a new budget to track expenses.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  label="Budget Name"
                  name="name"
                  value={formData.name}
                  onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
                  validation={nameSchema}
                  required
                />
                <FormField
                  label="Department"
                  name="department"
                  type="select"
                  value={formData.department}
                  onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
                  selectOptions={[
                    { value: "Marketing", label: "Marketing" },
                    { value: "Operations", label: "Operations" },
                    { value: "IT", label: "IT" },
                    { value: "HR", label: "HR" },
                    { value: "R&D", label: "R&D" },
                  ]}
                  required
                />
                <FormField
                  label="Total Amount"
                  name="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
                  validation={amountSchema}
                  required
                />
                <FormField
                  label="Spent Amount"
                  name="spentAmount"
                  type="number"
                  value={formData.spentAmount}
                  onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
                  validation={amountSchema}
                  required
                />
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Remaining Amount</span>
                    <span className="text-sm font-medium">
                      ${(formData.totalAmount - formData.spentAmount).toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={formData.totalAmount > 0 ? 100 - (formData.spentAmount / formData.totalAmount) * 100 : 0}
                    className="h-2"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBudget}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageActions>
      </PageHeader>

      <PageContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudgetAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across {budgets.length} budget allocations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpentAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{overallProgress}% of total budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRemainingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{100 - overallProgress}% of total budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.entries(budgetsByDepartment).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                $
                {Object.entries(budgetsByDepartment)
                  .sort((a, b) => b[1] - a[1])[0]?.[1]
                  .toLocaleString() || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Track your budget allocations and spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Overall Budget</span>
                    <span className="text-muted-foreground">
                      ${totalSpentAmount.toLocaleString()} of ${totalBudgetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                {/* Department-specific progress bars */}
                {Object.entries(budgetsByDepartment).map(([department, amount], index) => {
                  const spent = budgets
                    .filter((b) => b.department === department)
                    .reduce((sum, b) => sum + b.spentAmount, 0)
                  const progress = amount > 0 ? Math.round((spent / amount) * 100) : 0

                  return (
                    <div key={department} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{department}</span>
                        <span className="text-muted-foreground">
                          ${spent.toLocaleString()} of ${amount.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        className="h-2"
                        indicatorClassName={
                          progress < 50 ? "bg-green-500" : progress < 75 ? "bg-yellow-500" : "bg-red-500"
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Distribution</CardTitle>
              <CardDescription>By department</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-[200px] w-[200px] flex items-center justify-center">
                <PieChart className="h-24 w-24 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Budget Allocations</CardTitle>
                <CardDescription>Manage all your budget allocations</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={columns} data={budgets} searchPlaceholder="Search budgets..." />
          </CardContent>
        </Card>
      </PageContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>Update the budget information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormField
              label="Budget Name"
              name="name"
              value={formData.name}
              onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
              validation={nameSchema}
              required
            />
            <FormField
              label="Department"
              name="department"
              type="select"
              value={formData.department}
              onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
              selectOptions={[
                { value: "Marketing", label: "Marketing" },
                { value: "Operations", label: "Operations" },
                { value: "IT", label: "IT" },
                { value: "HR", label: "HR" },
                { value: "R&D", label: "R&D" },
              ]}
              required
            />
            <FormField
              label="Total Amount"
              name="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
              validation={amountSchema}
              required
            />
            <FormField
              label="Spent Amount"
              name="spentAmount"
              type="number"
              value={formData.spentAmount}
              onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
              validation={amountSchema}
              required
            />
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Remaining Amount</span>
                <span className="text-sm font-medium">
                  ${(formData.totalAmount - formData.spentAmount).toLocaleString()}
                </span>
              </div>
              <Progress
                value={formData.totalAmount > 0 ? 100 - (formData.spentAmount / formData.totalAmount) * 100 : 0}
                className="h-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBudget}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
