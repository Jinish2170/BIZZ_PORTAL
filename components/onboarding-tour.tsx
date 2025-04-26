"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface TourStep {
  title: string
  description: string
  target: string
  placement: "top" | "bottom" | "left" | "right"
  page: string
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to BizzPortal",
    description: "This is your business management dashboard. Let's take a quick tour!",
    target: "body",
    placement: "top",
    page: "/",
  },
  {
    title: "Dashboard Overview",
    description: "Here you can see key metrics and charts for your business at a glance.",
    target: ".dashboard-cards",
    placement: "bottom",
    page: "/",
  },
  {
    title: "Manage Suppliers",
    description: "Add, edit, and track all your suppliers in one place.",
    target: ".suppliers-link",
    placement: "right",
    page: "/",
  },
  {
    title: "Budget Tracking",
    description: "Monitor your budgets with visual progress indicators.",
    target: ".budgets-link",
    placement: "right",
    page: "/",
  },
  {
    title: "Document Management",
    description: "Upload and organize all your business documents securely.",
    target: ".documents-link",
    placement: "right",
    page: "/",
  },
  {
    title: "Analytics & Insights",
    description: "Visualize your data with interactive charts and reports.",
    target: ".analytics-link",
    placement: "right",
    page: "/",
  },
]

export function OnboardingTour() {
  const [showTour, setShowTour] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenTour = localStorage.getItem("bizz-portal-tour-completed")
    if (!hasSeenTour) {
      setShowTour(true)
    }
  }, [])

  const handleSkipTour = () => {
    setShowTour(false)
    localStorage.setItem("bizz-portal-tour-completed", "true")
  }

  const handleNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowTour(false)
      localStorage.setItem("bizz-portal-tour-completed", "true")
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Only show steps relevant to the current page
  const currentPageSteps = tourSteps.filter((step) => step.page === pathname || step.page === "*")

  if (!showTour || currentPageSteps.length === 0) {
    return null
  }

  const step = tourSteps[currentStep]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 z-50 max-w-md"
      >
        <Card className="border-primary shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleSkipTour}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Step {currentStep + 1} of {tourSteps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{step.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button onClick={handleNextStep}>{currentStep < tourSteps.length - 1 ? "Next" : "Finish"}</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
