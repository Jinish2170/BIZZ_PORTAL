"use client"

import React from "react"

import { Bell, Mail, CalendarIcon } from "lucide-react"
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
import { useEffect, useState } from "react"

export function AppHeader() {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState("Dashboard")
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; path: string }[]>([])

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
        <Button variant="ghost" size="icon" className="relative">
          <Mail className="h-5 w-5" />
          <span className="sr-only">Messages</span>
          <span className="absolute right-1 top-1.5 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <span className="absolute right-1 top-1.5 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        <Button variant="ghost" size="icon">
          <CalendarIcon className="h-5 w-5" />
          <span className="sr-only">Calendar</span>
        </Button>
        <HelpDialog />
        <ThemeToggle />
      </div>
    </header>
  )
}
