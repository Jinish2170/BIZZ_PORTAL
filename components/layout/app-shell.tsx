"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { AccessibilityImprovements } from "@/components/accessibility-improvements"
import { useAuth } from "@/lib/auth-context"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  // Don't show the shell layout on the login page
  if (isLoginPage || !isAuthenticated) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">{children}</main>
          <div className="border-t py-3 px-6 text-center text-xs text-muted-foreground">
            <p>© 2025 BizzPortal. All rights reserved.</p>
          </div>
        </SidebarInset>
      </div>
      <AccessibilityImprovements />
    </SidebarProvider>
  )
}
