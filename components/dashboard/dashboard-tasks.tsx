"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Invoice, Budget } from "@/lib/store"

interface Task {
  id: string
  title: string
  completed: boolean
  due: string
  priority: "high" | "medium" | "low"
}

export function DashboardTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
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

        const generatedTasks: Task[] = []

        // Generate tasks from overdue invoices
        const overdueInvoices = invoices.filter((inv: Invoice) => {
          const dueDate = new Date(inv.due_date)
          const today = new Date()
          return dueDate < today && inv.status === 'unpaid'
        })

        overdueInvoices.slice(0, 2).forEach((invoice: Invoice) => {
          generatedTasks.push({
            id: `invoice-${invoice.id}`,
            title: `Follow up on overdue invoice #${invoice.id}`,
            completed: false,
            due: "Overdue",
            priority: "high",
          })
        })

        // Generate tasks from upcoming invoices
        const upcomingInvoices = invoices.filter((inv: Invoice) => {
          const dueDate = new Date(inv.due_date)
          const today = new Date()
          const tomorrow = new Date(today)
          tomorrow.setDate(today.getDate() + 1)
          return dueDate <= tomorrow && dueDate >= today && inv.status === 'unpaid'
        })

        upcomingInvoices.slice(0, 2).forEach((invoice: Invoice) => {
          generatedTasks.push({
            id: `upcoming-${invoice.id}`,
            title: `Review invoice #${invoice.id} due today`,
            completed: false,
            due: "Today",
            priority: "medium",
          })
        })

        // Generate tasks from budgets
        budgets.slice(0, 2).forEach((budget: Budget) => {
          const spent = parseFloat(budget.spent_amount.toString())
          const total = parseFloat(budget.total_amount.toString())
          const percentage = (spent / total) * 100

          if (percentage > 80) {
            generatedTasks.push({
              id: `budget-${budget.id}`,
              title: `Review ${budget.name} budget - ${percentage.toFixed(0)}% used`,
              completed: false,
              due: "This week",
              priority: percentage > 95 ? "high" : "medium",
            })
          }
        })

        // Add some default tasks if no dynamic tasks
        if (generatedTasks.length === 0) {
          generatedTasks.push(
            {
              id: "default-1",
              title: "Review monthly financial reports",
              completed: false,
              due: "Today",
              priority: "medium",
            },
            {
              id: "default-2",
              title: "Update supplier information",
              completed: false,
              due: "Tomorrow",
              priority: "low",
            }
          )
        }

        setTasks(generatedTasks.slice(0, 5)) // Show max 5 tasks
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  // Filter tasks: incomplete first, then by priority (high, medium, low)
  const sortedTasks = [...tasks].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return (
      priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
    )
  })

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 animate-pulse">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    task.priority === "high"
                      ? "destructive"
                      : task.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                  className="text-xs px-2 py-0"
                >
                  {task.priority}
                </Badge>
                <span className={cn(
                  "text-xs",
                  task.due === "Overdue" ? "text-red-600" : 
                  task.due === "Today" ? "text-amber-600" : 
                  "text-muted-foreground"
                )}>
                  {task.due}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="ghost" size="sm" className="w-full mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
  )
}
