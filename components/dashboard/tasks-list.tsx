"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const initialTasks = [
  {
    id: "task-1",
    title: "Review Q3 budget proposals",
    completed: false,
    dueDate: "Today",
    priority: "high",
  },
  {
    id: "task-2",
    title: "Approve pending invoices",
    completed: false,
    dueDate: "Tomorrow",
    priority: "medium",
  },
  {
    id: "task-3",
    title: "Update supplier contracts",
    completed: false,
    dueDate: "Sep 28",
    priority: "medium",
  },
  {
    id: "task-4",
    title: "Prepare monthly financial report",
    completed: false,
    dueDate: "Sep 30",
    priority: "high",
  },
  {
    id: "task-5",
    title: "Schedule Q4 planning meeting",
    completed: true,
    dueDate: "Completed",
    priority: "low",
  },
]

export function TasksList() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-start space-x-2 rounded-md p-2 transition-colors",
            task.completed ? "text-muted-foreground line-through" : "",
            !task.completed && "hover:bg-muted/50",
          )}
        >
          <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
          <div className="grid gap-1">
            <label
              htmlFor={task.id}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                task.completed && "text-muted-foreground",
              )}
            >
              {task.title}
            </label>
            <div className="flex items-center text-xs">
              <span
                className={cn(
                  "mr-2 rounded-full px-2 py-0.5 text-xs font-medium",
                  task.priority === "high" && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
                  task.priority === "medium" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                  task.priority === "low" &&
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                )}
              >
                {task.priority}
              </span>
              <span className="text-muted-foreground">{task.dueDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
