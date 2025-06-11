"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Supplier, Budget, Invoice, Document } from "@/lib/store"

interface ActivityItem {
  id: string
  user: {
    name: string
    initials: string
    avatarColor: string
  }
  action: string
  target: string
  time: string
  category: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, budgetsRes, invoicesRes, documentsRes] = await Promise.all([
          fetch('/api/suppliers'),
          fetch('/api/budgets'),
          fetch('/api/invoices'),
          fetch('/api/documents')
        ])

        const [suppliers, budgets, invoices, documents] = await Promise.all([
          suppliersRes.json(),
          budgetsRes.json(),
          invoicesRes.json(),
          documentsRes.json()
        ])

        // Generate recent activities based on real data
        const recentActivities: ActivityItem[] = []

        // Add recent invoices
        invoices.slice(0, 3).forEach((invoice: Invoice, index: number) => {
          recentActivities.push({
            id: `invoice-${invoice.id}`,
            user: {
              name: "System",
              initials: "SY",
              avatarColor: "bg-blue-500",
            },
            action: "created",
            target: `Invoice #${invoice.id} for ${invoice.supplier_name || 'Supplier'}`,
            time: `${index + 1} ${index === 0 ? 'hour' : 'hours'} ago`,
            category: "invoice",
          })
        })

        // Add recent documents
        documents.slice(0, 2).forEach((doc: Document, index: number) => {
          recentActivities.push({
            id: `doc-${doc.id}`,
            user: {
              name: doc.uploaded_by,
              initials: doc.uploaded_by.split(' ').map(n => n[0]).join('').toUpperCase(),
              avatarColor: "bg-purple-500",
            },
            action: "uploaded",
            target: doc.name,
            time: `${index + 2} hours ago`,
            category: "document",
          })
        })

        // Add recent budgets
        budgets.slice(0, 2).forEach((budget: Budget, index: number) => {
          recentActivities.push({
            id: `budget-${budget.id}`,
            user: {
              name: "Admin",
              initials: "AD",
              avatarColor: "bg-green-500",
            },
            action: "updated",
            target: `Budget: ${budget.name}`,
            time: `${index + 3} hours ago`,
            category: "budget",
          })
        })

        // Add recent suppliers
        suppliers.slice(0, 2).forEach((supplier: Supplier, index: number) => {
          recentActivities.push({
            id: `supplier-${supplier.id}`,
            user: {
              name: "Manager",
              initials: "MG",
              avatarColor: "bg-amber-500",
            },
            action: supplier.status === 'active' ? "activated" : "updated",
            target: `Supplier: ${supplier.name}`,
            time: `${index + 4} hours ago`,
            category: "supplier",
          })
        })

        setActivities(recentActivities.slice(0, 6)) // Show max 6 activities
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
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
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={cn("text-white", activity.user.avatarColor)}>
              {activity.user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  activity.category === "invoice" && "bg-blue-500",
                  activity.category === "document" && "bg-purple-500",
                  activity.category === "budget" && "bg-green-500",
                  activity.category === "supplier" && "bg-amber-500",
                )}
              />
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
