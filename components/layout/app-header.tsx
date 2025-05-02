"use client"

import React from "react"

import { Bell, Mail, CalendarIcon, User, LogOut } from "lucide-react"
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
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const [pageTitle, setPageTitle] = useState("Dashboard")
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; path: string }[]>([])
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

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

  const handleLogout = () => {
    logout()
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

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
        {/* Messages Dialog */}
        <Dialog open={isMessagesOpen} onOpenChange={setIsMessagesOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Messages</span>
              <span className="absolute right-1 top-1.5 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Messages</DialogTitle>
              <DialogDescription>Your recent messages and conversations.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">Quick question about the budget...</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Alice Smith</p>
                    <p className="text-sm text-muted-foreground">The supplier contract is ready for review.</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsMessagesOpen(false)}>View All Messages</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notifications Dialog */}
        <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1.5 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>Your recent notifications and alerts.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm font-medium">Budget Alert</p>
                <p className="text-sm text-muted-foreground">The Marketing budget has reached 80% utilization.</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm font-medium">New Document</p>
                <p className="text-sm text-muted-foreground">Q2 Financial Report has been uploaded.</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm font-medium">Invoice Due</p>
                <p className="text-sm text-muted-foreground">Invoice #INV-2023-004 is due in 3 days.</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsNotificationsOpen(false)}>View All Notifications</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Calendar Dialog */}
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <CalendarIcon className="h-5 w-5" />
              <span className="sr-only">Calendar</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Calendar</DialogTitle>
              <DialogDescription>Your upcoming events and meetings.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">Weekly Team Meeting</p>
                <p className="text-xs text-muted-foreground">Today, 2:00 PM - 3:00 PM</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">Budget Review</p>
                <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM - 11:30 AM</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">Supplier Negotiation</p>
                <p className="text-xs text-muted-foreground">May 5, 2025, 1:00 PM - 2:30 PM</p>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsCalendarOpen(false)}>View Full Calendar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <HelpDialog />
        <ThemeToggle />
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
