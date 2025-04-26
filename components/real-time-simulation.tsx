"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Simulated real-time updates
const simulatedUpdates = [
  {
    type: "supplier",
    message: "New supplier 'Tech Solutions Inc.' has been added by another user.",
    delay: 45000, // 45 seconds
  },
  {
    type: "budget",
    message: "Budget 'Marketing' has been updated by another user.",
    delay: 90000, // 90 seconds
  },
  {
    type: "document",
    message: "New document 'Q2 Financial Report.pdf' has been uploaded.",
    delay: 120000, // 2 minutes
  },
]

export function RealTimeSimulation() {
  const { toast } = useToast()
  const pathname = usePathname()
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Only show real-time updates if the user has been active for a while
    const hasUsedApp = localStorage.getItem("bizz-portal-has-used-app")
    if (!hasUsedApp) {
      localStorage.setItem("bizz-portal-has-used-app", "true")
      setIsActive(false)
      return
    }

    // Set up timers for simulated real-time updates
    const timers = simulatedUpdates.map((update) => {
      return setTimeout(() => {
        if (isActive) {
          toast({
            title: "Real-time Update",
            description: update.message,
          })
        }
      }, update.delay)
    })

    // Clean up timers
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toast, isActive])

  // Reset active state when navigating to a new page
  useEffect(() => {
    setIsActive(true)
  }, [pathname])

  return null
}
