"use client"

import React from "react"

import { Bell, Mail, CalendarIcon, Loader2, AlertCircle, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { HelpDialog } from "@/components/help-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"

export function AppHeader() {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState("Dashboard")
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; path: string }[]>([])
  const { toast } = useToast()

  // Real data from APIs
  interface Notification {
    id: string
    title: string
    message: string
    time: string
    unread: boolean
  }

  interface Message {
    id: number
    sender: string
    message: string
    time: string
    unread: boolean
  }

  interface CalendarEvent {
    id: string
    title: string
    date: Date
    type: 'invoice' | 'budget' | 'meeting'
    priority: 'high' | 'medium' | 'low'
  }

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Format relative time
  const formatRelativeTime = useCallback((dateString: string | undefined) => {
    if (!dateString) return 'Recently'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Recently'
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }, [])

  // Fetch real data from APIs
  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const [invoicesRes, budgetsRes, documentsRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/budgets'),
        fetch('/api/documents')
      ])

      if (!invoicesRes.ok || !budgetsRes.ok || !documentsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [invoices, budgets, documents] = await Promise.all([
        invoicesRes.json(),
        budgetsRes.json(),
        documentsRes.json()
      ])

      // Generate notifications from real data
      const realNotifications: Notification[] = []
      
      // Recent invoices as notifications (only pending ones)
      const pendingInvoices = invoices.filter((inv: any) => inv.status === 'pending').slice(0, 3)
      pendingInvoices.forEach((invoice: any) => {
        realNotifications.push({
          id: `inv-${invoice.id}`,
          title: 'New Invoice Received',
          message: `Invoice #${invoice.invoice_number} from ${invoice.supplier_name} - $${parseFloat(invoice.amount).toLocaleString()}`,
          time: formatRelativeTime(invoice.created_at),
          unread: true
        })
      })

      // Budget alerts (only over 75% utilization)
      budgets.forEach((budget: any) => {
        const totalAmount = typeof budget.total_amount === 'string' ? parseFloat(budget.total_amount) : budget.total_amount
        const spentAmount = typeof budget.spent_amount === 'string' ? parseFloat(budget.spent_amount) : budget.spent_amount
        const utilization = totalAmount > 0 ? (spentAmount / totalAmount) * 100 : 0
        
        if (utilization > 75) {
          realNotifications.push({
            id: `budget-${budget.id}`,
            title: 'Budget Alert',
            message: `${budget.department} budget is ${utilization.toFixed(1)}% utilized`,
            time: formatRelativeTime(budget.created_at || budget.updated_at),
            unread: utilization > 90 // Mark as unread if over 90%
          })
        }
      })

      // Recent document uploads (last 5)
      const recentDocs = documents.slice(-5)
      recentDocs.forEach((doc: any) => {
        realNotifications.push({
          id: `doc-${doc.id}`,
          title: 'Document Uploaded',
          message: `${doc.file_name} has been uploaded to ${doc.folder || 'Documents'}`,
          time: formatRelativeTime(doc.created_at || doc.upload_date),
          unread: false
        })
      })

      // Sort notifications by most recent first
      realNotifications.sort((a, b) => {
        // Unread notifications first, then by recency
        if (a.unread && !b.unread) return -1
        if (!a.unread && b.unread) return 1
        return 0
      })

      // Generate messages from invoice data (simulating supplier communication)
      const recentMessages: Message[] = invoices
        .filter((inv: any) => inv.status === 'pending' || inv.status === 'overdue')
        .slice(0, 5)
        .map((invoice: any) => ({
          id: invoice.id,
          sender: invoice.supplier_name,
          message: invoice.status === 'overdue' 
            ? `Invoice #${invoice.invoice_number} is overdue. Please process payment.`
            : `Invoice #${invoice.invoice_number} pending approval - $${parseFloat(invoice.amount).toLocaleString()}`,
          time: formatRelativeTime(invoice.created_at),
          unread: invoice.status === 'overdue'
        }))

      setNotifications(realNotifications)
      setMessages(recentMessages)

      // Generate calendar events from real data
      const events: CalendarEvent[] = []

      // Invoice due dates
      invoices.forEach((invoice: any) => {
        if (invoice.due_date) {
          const dueDate = new Date(invoice.due_date)
          if (!isNaN(dueDate.getTime())) {
            events.push({
              id: `invoice-${invoice.id}`,
              title: `Invoice #${invoice.invoice_number} due`,
              date: dueDate,
              type: 'invoice',
              priority: invoice.status === 'overdue' ? 'high' : 'medium'
            })
          }
        }
      })

      // Budget review dates (end of each month for active budgets)
      budgets.forEach((budget: any) => {
        const now = new Date()
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        events.push({
          id: `budget-${budget.id}`,
          title: `${budget.department} budget review`,
          date: endOfMonth,
          type: 'budget',
          priority: 'low'
        })
      })

      // Add some sample meetings
      const today = new Date()
      events.push({
        id: 'meeting-1',
        title: 'Weekly Finance Review',
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        type: 'meeting',
        priority: 'high'
      })

      setCalendarEvents(events)
    } catch (error) {
      console.error('Error fetching header data:', error)
      setError('Failed to load notifications')
      setNotifications([])
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [formatRelativeTime])

  useEffect(() => {
    fetchData()
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  const unreadNotifications = notifications.filter(n => n.unread).length
  const unreadMessages = messages.filter(m => m.unread).length

  const handleCalendarClick = () => {
    // This will open the calendar popover - no action needed
  }

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getTodaysEvents = () => {
    const today = new Date()
    return getEventsForDate(today)
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= today && eventDate <= nextWeek
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-blue-500'
    }
  }

  const handleNotificationClick = (notificationId: string) => {
    // Mark notification as read
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
    )
    
    toast({
      title: "Notification",
      description: "Notification marked as read",
    })
  }

  const handleMessageClick = (messageId: number) => {
    // Mark message as read
    setMessages(prev => 
      prev.map(m => m.id === messageId ? { ...m, unread: false } : m)
    )
    
    toast({
      title: "Message",
      description: "Opening message details...",
    })
  }

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    toast({
      title: "All notifications marked as read",
      description: "Your notifications have been cleared",
    })
  }

  const markAllMessagesRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, unread: false })))
    toast({
      title: "All messages marked as read", 
      description: "Your messages have been cleared",
    })
  }

  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length === 0) {
      setPageTitle("Dashboard")
      setBreadcrumbs([])
      return
    }

    // Generate breadcrumbs
    const breadcrumbsArray = parts.map((part, index) => {
      const path = `/${parts.slice(0, index + 1).join("/")}`
      return {
        name: part.charAt(0).toUpperCase() + part.slice(1),
        path,
      }
    })

    setPageTitle(parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1))
    setBreadcrumbs(breadcrumbsArray)
  }, [pathname])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem key={breadcrumb.path}>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.path}>{breadcrumb.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        {/* Messages */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Messages</span>
              {loading && <Loader2 className="absolute -right-1 -top-1 h-3 w-3 animate-spin" />}
              {!loading && unreadMessages > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 sm:w-96 max-w-[calc(100vw-1rem)] p-0" align="end" sideOffset={8}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Messages</h4>
                  <p className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : error ? 'Error loading messages' : `${unreadMessages} unread messages`}
                  </p>
                </div>
                {!loading && unreadMessages > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllMessagesRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="text-center">
                      <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm">{error}</p>
                      <Button variant="ghost" size="sm" onClick={fetchData} className="mt-2">
                        Retry
                      </Button>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="text-center">
                      <Mail className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm">No messages</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                        message.unread ? 'bg-muted/30 border-l-2 border-primary' : ''
                      }`}
                      onClick={() => handleMessageClick(message.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${message.unread ? 'font-semibold' : 'font-medium'}`}>
                          {message.sender}
                        </span>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              {loading && <Loader2 className="absolute -right-1 -top-1 h-3 w-3 animate-spin" />}
              {!loading && unreadNotifications > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 sm:w-96 max-w-[calc(100vw-1rem)] p-0" align="end" sideOffset={8}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : error ? 'Error loading notifications' : `${unreadNotifications} unread notifications`}
                  </p>
                </div>
                {!loading && unreadNotifications > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllNotificationsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="text-center">
                      <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm">{error}</p>
                      <Button variant="ghost" size="sm" onClick={fetchData} className="mt-2">
                        Retry
                      </Button>
                    </div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="text-center">
                      <Bell className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                        notification.unread ? 'bg-muted/30 border-l-2 border-primary' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${notification.unread ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Calendar */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <CalendarIcon className="h-5 w-5" />
              <span className="sr-only">Calendar</span>
              {getTodaysEvents().length > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-blue-500">
                  {getTodaysEvents().length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 sm:w-96 max-w-[calc(100vw-1rem)] p-0" align="end" sideOffset={8}>
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Calendar</h4>
                  <p className="text-xs text-muted-foreground">
                    {getTodaysEvents().length} events today
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Event
                </Button>
              </div>
            </div>
            
            <div className="p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0 p-0 w-full"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-2",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-xs font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 text-xs",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-7 font-normal text-xs",
                  row: "flex w-full mt-1",
                  cell: "h-7 w-7 text-center text-xs p-0 relative focus-within:relative focus-within:z-20",
                  day: "h-7 w-7 p-0 font-normal text-xs hover:bg-accent hover:text-accent-foreground",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground font-semibold",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                }}
                modifiers={{
                  hasEvents: calendarEvents.map(event => new Date(event.date))
                }}
                modifiersStyles={{
                  hasEvents: { backgroundColor: 'rgba(59, 130, 246, 0.1)', fontWeight: '600' }
                }}
              />
            </div>

            <div className="border-t">
              <div className="p-3">
                <h5 className="font-medium mb-2 flex items-center text-sm">
                  <Clock className="h-3 w-3 mr-2" />
                  {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Upcoming Events'}
                </h5>
                <ScrollArea className="h-[150px]">
                  {selectedDate ? (
                    getEventsForDate(selectedDate).length > 0 ? (
                      <div className="space-y-1.5">
                        {getEventsForDate(selectedDate).map((event) => (
                          <div
                            key={event.id}
                            className="p-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(event.priority)}`} />
                              <span className="font-medium text-xs">{event.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground capitalize pl-3.5">
                              {event.type} • {event.priority} priority
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 text-muted-foreground">
                        <CalendarIcon className="h-6 w-6 mx-auto mb-1 opacity-50" />
                        <p className="text-xs">No events for this date</p>
                      </div>
                    )
                  ) : (
                    <div className="space-y-1.5">
                      {getUpcomingEvents().slice(0, 4).map((event) => (
                        <div
                          key={event.id}
                          className="p-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(event.priority)}`} />
                            <span className="font-medium text-xs">{event.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground pl-3.5">
                            {new Date(event.date).toLocaleDateString()} • {event.type}
                          </p>
                        </div>
                      ))}
                      {getUpcomingEvents().length === 0 && (
                        <div className="text-center py-3 text-muted-foreground">
                          <CalendarIcon className="h-6 w-6 mx-auto mb-1 opacity-50" />
                          <p className="text-xs">No upcoming events</p>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <HelpDialog />
        <ThemeToggle />
      </div>
    </header>
  )
}
