"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function AccessibilityImprovements() {
  const { toast } = useToast()

  useEffect(() => {
    // Add keyboard shortcut for navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + number shortcuts for navigation
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const navLinks = [
          { key: "1", path: "/" },
          { key: "2", path: "/suppliers" },
          { key: "3", path: "/budgets" },
          { key: "4", path: "/documents" },
          { key: "5", path: "/analytics" },
        ]

        const keyPressed = e.key
        const navLink = navLinks.find((link) => link.key === keyPressed)

        if (navLink) {
          e.preventDefault()
          window.location.href = navLink.path
        }
      }

      // Press ? for help
      if (e.key === "?" && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault()
        document.querySelector('[aria-label="Help"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Show accessibility toast on first load
    const hasSeenA11yTip = localStorage.getItem("bizz-portal-a11y-tip-shown")
    if (!hasSeenA11yTip) {
      setTimeout(() => {
        toast({
          title: "Keyboard Shortcuts Available",
          description: "Press Alt+1-5 to navigate pages or ? for help",
        })
        localStorage.setItem("bizz-portal-a11y-tip-shown", "true")
      }, 3000)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [toast])

  return null
}
