"use client"

import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardUpcomingPayments() {
  const { invoices } = useStore()

  // Get today's date and 7 days from now
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  // Filter upcoming payments (due within the next 7 days)
  const upcomingPayments = invoices
    .filter((invoice) => {
      const dueDate = new Date(invoice.dueDate)
      return (invoice.status === "pending" || invoice.status === "overdue") && dueDate >= today && dueDate <= nextWeek
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Function to format a date to a string like "28 Apr" or "Today", "Tomorrow"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()

    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return "Today"
    }

    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return "Tomorrow"
    }

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    })
  }

  if (upcomingPayments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
        <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">No Upcoming Payments</h3>
        <p className="text-sm text-muted-foreground mt-1">There are no invoices due in the next 7 days</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-4 bg-muted/50 p-3 text-sm font-medium">
          <div className="col-span-2">Invoice</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Due Date</div>
        </div>
        <div className="divide-y">
          {upcomingPayments.map((invoice) => (
            <div key={invoice.id} className="grid grid-cols-4 items-center p-3">
              <div className="col-span-2">
                <div className="font-medium">{invoice.client}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{invoice.invoiceNumber}</div>
              </div>
              <div className="text-right font-medium">${invoice.amount.toLocaleString()}</div>
              <div className="flex justify-end items-center">
                <Badge
                  variant={
                    invoice.status === "overdue"
                      ? "destructive"
                      : formatDate(invoice.dueDate) === "Today"
                        ? "warning"
                        : "outline"
                  }
                >
                  {formatDate(invoice.dueDate)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          <DollarSign className="mr-1 h-4 w-4" /> Pay Selected
        </Button>
      </div>
    </div>
  )
}
