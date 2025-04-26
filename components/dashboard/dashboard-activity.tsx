"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  action: string
  target: string
  time: string
}

export function DashboardActivity() {
  const activities: Activity[] = [
    {
      id: "1",
      user: {
        name: "John Doe",
        initials: "JD",
      },
      action: "created",
      target: "Invoice #INV-2025-007",
      time: "5 minutes ago",
    },
    {
      id: "2",
      user: {
        name: "Sarah Williams",
        initials: "SW",
      },
      action: "uploaded",
      target: "Q2 Financial Report.pdf",
      time: "1 hour ago",
    },
    {
      id: "3",
      user: {
        name: "Mike Johnson",
        initials: "MJ",
      },
      action: "updated",
      target: "Budget for Marketing",
      time: "3 hours ago",
    },
    {
      id: "4",
      user: {
        name: "Lisa Taylor",
        initials: "LT",
      },
      action: "added",
      target: "Acme Inc. as a supplier",
      time: "Yesterday",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across the platform</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className={cn("flex items-start gap-4", i !== activities.length - 1 && "pb-4 border-b border-border")}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Button variant="ghost" size="sm" className="w-full">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  )
}
