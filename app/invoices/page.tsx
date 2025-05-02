"use client"

import { useState } from "react"
import { InvoiceDashboard } from "@/components/invoices/invoice-dashboard"
import { InvoiceFileUpload } from "@/components/invoices/invoice-file-upload"

export default function InvoicesPage() {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  
  return (
    <div className="space-y-6">
      <InvoiceDashboard onInvoiceSelect={setSelectedInvoiceId} />
      {selectedInvoiceId && (
        <InvoiceFileUpload invoiceId={selectedInvoiceId} />
      )}
    </div>
  )
}
