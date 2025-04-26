"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export function HelpDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>BizzPortal Help & FAQ</DialogTitle>
          <DialogDescription>
            Find answers to common questions and learn how to use BizzPortal effectively.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I add a new supplier?</AccordionTrigger>
              <AccordionContent>
                <p>To add a new supplier:</p>
                <ol className="list-decimal pl-5 space-y-1 mt-2">
                  <li>Navigate to the Suppliers page</li>
                  <li>Click the "Add Supplier" button in the top right</li>
                  <li>Fill out the supplier details in the form</li>
                  <li>Click "Save" to add the supplier to your list</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I track budget usage?</AccordionTrigger>
              <AccordionContent>
                <p>BizzPortal makes it easy to track your budget usage:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>The Dashboard shows overall budget usage</li>
                  <li>The Budgets page shows detailed progress for each budget</li>
                  <li>You can update spent amounts at any time</li>
                  <li>The Analytics page provides visual charts of budget allocation</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How do I upload documents?</AccordionTrigger>
              <AccordionContent>
                <p>To upload and manage documents:</p>
                <ol className="list-decimal pl-5 space-y-1 mt-2">
                  <li>Go to the Documents page</li>
                  <li>Click on the upload area or drag and drop your file</li>
                  <li>Click the "Upload" button</li>
                  <li>Your document will appear in the documents list</li>
                </ol>
                <p className="mt-2">Supported file types include PDF, DOCX, XLSX, JPG, and PNG.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do I use the Analytics features?</AccordionTrigger>
              <AccordionContent>
                <p>The Analytics page offers powerful insights:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Switch between Charts and Trends tabs to view different visualizations</li>
                  <li>Use the time period filter to adjust the data range</li>
                  <li>Click on chart elements to see detailed information</li>
                  <li>Review Key Insights for important business trends</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Can I customize the dashboard?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Currently, the dashboard shows fixed metrics and charts. In future updates, we plan to add
                  customization options that will allow you to:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Choose which metrics appear on your dashboard</li>
                  <li>Rearrange dashboard components</li>
                  <li>Create custom charts and visualizations</li>
                  <li>Set up personalized alerts and notifications</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>Need more help? Contact support at support@bizzportal.com</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
