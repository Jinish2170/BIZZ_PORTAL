"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  BarChart4,
  ChevronLeft,
  Menu,
  FileBarChart,
  Receipt,
  Settings,
  LogOut,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentUser } = useStore()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Check if screen is mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setCollapsed(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      description: "Overview of your business",
    },
    {
      name: "Suppliers",
      href: "/suppliers",
      icon: Users,
      description: "Manage your suppliers",
    },
    {
      name: "Budgets",
      href: "/budgets",
      icon: Wallet,
      description: "Track your budgets",
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
      description: "Manage your documents",
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: Receipt,
      description: "Track your invoices",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart4,
      description: "Visualize your data",
    },
    {
      name: "Business Analysis",
      href: "/analysis",
      icon: FileBarChart,
      description: "Advanced business insights",
    },
  ]

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
  }

  const mobileMenuVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 lg:hidden" onClick={toggleMobileSidebar}>
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar */}
      <motion.div
        className="fixed top-0 left-0 z-50 h-full w-[280px] bg-card border-r shadow-lg lg:hidden"
        initial="closed"
        animate={mobileOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-md bg-primary p-1">
                <span className="text-lg font-bold text-primary-foreground">BP</span>
              </div>
              <span className="text-xl font-bold">BizzPortal</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs opacity-70">{item.description}</span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatar.png" alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{currentUser?.name}</span>
                  <span className="text-xs text-muted-foreground">{currentUser?.role}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Desktop Sidebar */}
      <motion.div
        className={cn("hidden lg:flex h-screen flex-col border-r bg-card fixed top-0 left-0 z-30", className)}
        initial="expanded"
        animate={collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="flex h-16 items-center px-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <span className="text-lg font-bold text-primary-foreground">BP</span>
            </div>
            {!collapsed && <span className="text-xl font-bold">BizzPortal</span>}
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-1 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs opacity-70">{item.description}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
            {!collapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatar.png" alt={currentUser?.name} />
                    <AvatarFallback>{currentUser?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{currentUser?.name}</span>
                    <span className="text-xs text-muted-foreground">{currentUser?.role}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rotate-180">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
