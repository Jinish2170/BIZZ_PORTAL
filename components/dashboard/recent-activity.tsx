"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Sample activity data
const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      initials: "JD",
      avatarColor: "bg-blue-500",
    },
    action: "created",
    target: "Invoice #INV-2025-007",
    time: "10 minutes ago",
    category: "invoice",
  },
  {
    id: 2,
    user: {
      name: "Sarah Williams",
      initials: "SW",
      avatarColor: "bg-purple-500",
    },
    action: "uploaded",
    target: "Q2 Financial Report.pdf",
    time: "45 minutes ago",
    category: "document",
  },
  {
    id: 3,
    user: {
      name: "Mike Johnson",
      initials: "MJ",
      avatarColor: "bg-green-500",
    },
    action: "updated",
    target: "Budget for Marketing",
    time: "2 hours ago",
    category: "budget",
  },
  {
    id: 4,
    user: {
      name: "Lisa Taylor",
      initials: "LT",
      avatarColor: "bg-amber-500",
    },
    action: "added",
    target: "Acme Inc. as a supplier",
    time: "5 hours ago",
    category: "supplier",
  },
  {
    id: 5,
    user: {
      name: "Robert Johnson",
      initials: "RJ",
      avatarColor: "bg-rose-500",
    },
    action: "approved",
    target: "Invoice #INV-2025-006",
    time: "Yesterday",
    category: "invoice",
  },
  {
    id: 6,
    user: {
      name: "David Chen",
      initials: "DC",
      avatarColor: "bg-cyan-500",
    },
    action: "commented on",
    target: "Budget Forecast Report",
    time: "Yesterday",
    category: "document",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <Avatar className={cn("h-8 w-8", activity.user.avatarColor)}>
            <AvatarFallback className="text-xs font-medium text-white">{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
