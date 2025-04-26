"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Sample tasks data
const initialTasks = [
  {
    id: "task-1",
    title: "Review Q3 budget proposals",
    completed: false,
    due: "Today",
    priority: "high",
  },
  {
    id: "task-2",
    title: "Approve pending invoices",
    completed: false,
    due: "Tomorrow",
    priority: "medium",
  },
  {
    id: "task-3",
    title: "Update supplier contracts",
    completed: false,
    due: "Apr 28",
    priority: "medium",
  },
  {
    id: "task-4",
    title: "Prepare monthly financial report",
    completed: false,
    due: "Apr 30",
    priority: "high",
  },
  {
    id: "task-5",
    title: "Schedule Q4 planning meeting",
    completed: true,
    due: "Completed",
    priority: "low",
  },
]

export function DashboardTasks() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
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

  return (
    <div className="space-y-1">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-start justify-between gap-2 rounded-md p-2 transition-colors",
            task.completed && "text-muted-foreground",
            !task.completed && "hover:bg-muted/50",
          )}
        >
          <div className="flex items-start gap-2 min-w-0">
            <Checkbox
              id={task.id}
              checked={task.completed}
              onCheckedChange={() => toggleTaskCompletion(task.id)}
              className="mt-1"
            />
            <div className="min-w-0">
              <label
                htmlFor={task.id}
                className={cn(
                  "block text-sm font-medium truncate max-w-[200px] lg:max-w-full",
                  task.completed && "line-through",
                )}
              >
                {task.title}
              </label>
              <div className="flex items-center mt-1 gap-2">
                <Badge
                  variant={
                    task.priority === "high" ? "destructive" : task.priority === "medium" ? "warning" : "outline"
                  }
                  className="text-[10px] px-1 py-0 h-fit"
                >
                  {task.priority}
                </Badge>
                <span className="text-xs text-muted-foreground">Due: {task.due}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button variant="ghost" size="sm" className="w-full mt-2">
        <Plus className="mr-1 h-4 w-4" /> Add New Task
      </Button>
    </div>
  )
}
