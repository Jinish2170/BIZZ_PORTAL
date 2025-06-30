"use client"

import { DateRange } from 'react-day-picker'
import { useState, useEffect } from "react"
import { Plus, Download, DollarSign, Clock, CheckCircle2, AlertCircle, FileText, Printer, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceForm } from "./invoice-form"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"

interface Invoice {
  id: number;
  invoice_number: string;
  supplier_id: number;
  supplier_name?: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  issue_date: string;
  due_date: string;
  description: string;
}

export function InvoiceDashboard() {
  const { toast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
      })
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter !== "all" && invoice.status !== statusFilter) {
      return false
    }

    if (dateRange?.from && dateRange?.to) {
      const invoiceDate = new Date(invoice.issue_date)
      return invoiceDate >= dateRange.from && invoiceDate <= dateRange.to
    }

    return true
  })
  // Calculate totals
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount.toString()), 0)
  const totalPaid = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount.toString()), 0)
  const totalPending = invoices
    .filter((invoice) => invoice.status === "unpaid")
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount.toString()), 0)
  const totalOverdue = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount.toString()), 0)

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoice_number",
      header: "Invoice #",
      cell: ({ row }) => <div className="font-medium">{row.getValue("invoice_number")}</div>,
    },
    {
      accessorKey: "supplier_name",
      header: "Client",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (        <div className="font-medium">
          $
          {parseFloat(row.getValue("amount") as string).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      accessorKey: "issue_date",
      header: "Issue Date",
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string

        return (          <Badge
            variant={
              status === "paid"
                ? "success"
                : status === "unpaid"
                  ? "warning"
                  : status === "overdue"
                    ? "destructive"
                    : "outline"
            }
            className="capitalize"
          >
            {status === "paid" && <CheckCircle2 className="mr-1 h-3 w-3" />}
            {status === "unpaid" && <Clock className="mr-1 h-3 w-3" />}
            {status === "overdue" && <AlertCircle className="mr-1 h-3 w-3" />}
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const invoice = row.original

        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toast({
                  title: "Invoice details",
                  description: `Viewing invoice ${invoice.invoice_number}`,
                })
              }}
            >
              <FileText className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toast({
                  title: "Invoice printed",
                  description: `Invoice ${invoice.invoice_number} sent to printer`,
                })
              }}
            >
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toast({
                  title: "Invoice sent",
                  description: `Invoice ${invoice.invoice_number} sent to client`,
                })
              }}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        )
      },
    },
  ]

  const handleCreateInvoice = async (data: any) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          invoice_number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
          status: data.status || 'draft',
        }),
      })

      if (!response.ok) throw new Error('Failed to create invoice')

      await fetchInvoices()
      setIsCreateInvoiceOpen(false)

      toast({
        title: "Invoice created",
        description: "The invoice has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
      })
    }
  }

  const handleEditInvoice = async (id: number, data: any) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update invoice')

      await fetchInvoices()

      toast({
        title: "Invoice updated",
        description: "The invoice has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice",
      })
    }
  }

  const handleDeleteInvoice = async (id: number) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete invoice')

      await fetchInvoices()

      toast({
        title: "Invoice deleted",
        description: "The invoice has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
      })
    }
  }

  const handleExportInvoices = () => {
    toast({
      title: "Exporting invoices",
      description: "Your invoices are being exported as CSV",
    })

    // In a real application, this would trigger a download
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your invoices have been exported successfully",
      })
    }, 1500)
  }

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage and track your invoices and payments</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <InvoiceForm onSubmit={handleCreateInvoice} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleExportInvoices}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-auto md:flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <DatePickerWithRange 
              date={dateRange} 
              setDate={handleDateChange}
            />
          </CardContent>
        </Card>

        <Card className="w-full md:w-auto md:flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Invoiced</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Payment</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={filteredInvoices} searchPlaceholder="Search invoices..." />
    </div>
  )
}
