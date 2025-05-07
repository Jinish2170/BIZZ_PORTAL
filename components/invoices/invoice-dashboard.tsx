"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Download, DollarSign, Clock, CheckCircle2, AlertCircle, FileText, Printer, Mail } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataCard } from "@/components/ui/data-card"
import { InvoiceChart } from "@/components/invoices/invoice-chart"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useStore, type Invoice } from "@/lib/store"

export function InvoiceDashboard() {
  const { toast } = useToast()
  const { invoices, addInvoice, updateInvoice, deleteInvoice, updateInvoiceStatus } = useStore()

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter !== "all" && invoice.status !== statusFilter) {
      return false
    }

    if (dateRange?.from && dateRange?.to) {
      const invoiceDate = new Date(invoice.issueDate)
      return invoiceDate >= dateRange.from && invoiceDate <= dateRange.to
    }

    return true
  })

  // Calculate totals
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const totalPaid = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const totalPending = invoices
    .filter((invoice) => invoice.status === "pending")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const totalOverdue = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
      cell: ({ row }) => <div className="font-medium">{row.getValue("invoiceNumber")}</div>,
    },
    {
      accessorKey: "client",
      header: "Client",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          $
          {(row.getValue("amount") as number).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string

        return (
          <Badge
            variant={
              status === "paid"
                ? "success"
                : status === "pending"
                  ? "warning"
                  : status === "overdue"
                    ? "destructive"
                    : "outline"
            }
            className="capitalize"
          >
            {status === "paid" && <CheckCircle2 className="mr-1 h-3 w-3" />}
            {status === "pending" && <Clock className="mr-1 h-3 w-3" />}
            {status === "overdue" && <AlertCircle className="mr-1 h-3 w-3" />}
            {status === "draft" && <FileText className="mr-1 h-3 w-3" />}
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
                setSelectedInvoice(invoice)
                toast({
                  title: "Invoice details",
                  description: `Viewing invoice ${invoice.invoiceNumber}`,
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
                  description: `Invoice ${invoice.invoiceNumber} sent to printer`,
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
                  description: `Invoice ${invoice.invoiceNumber} sent to client`,
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

  const handleCreateInvoice = (data: any) => {
    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`

    addInvoice({
      ...data,
      invoiceNumber,
      status: data.status || "draft",
    })

    toast({
      title: "Invoice created",
      description: "The invoice has been created successfully",
    })
    setIsCreateInvoiceOpen(false)
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
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
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
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Total Invoiced"
          value={`$${totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="h-4 w-4" />}
          variant="primary"
        />
        <DataCard
          title="Total Paid"
          value={`$${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          variant="success"
          trend={{
            value: Math.round((totalPaid / totalInvoiced) * 100),
            label: "of total invoiced",
          }}
        />
        <DataCard
          title="Pending Payment"
          value={`$${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<Clock className="h-4 w-4" />}
          variant="warning"
          trend={{
            value: Math.round((totalPending / totalInvoiced) * 100),
            label: "of total invoiced",
          }}
        />
        <DataCard
          title="Overdue"
          value={`$${totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<AlertCircle className="h-4 w-4" />}
          variant="destructive"
          trend={{
            value: Math.round((totalOverdue / totalInvoiced) * 100),
            label: "of total invoiced",
          }}
        />
      </div>

      <Tabs defaultValue="invoices">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <DataTable columns={columns} data={filteredInvoices} searchPlaceholder="Search invoices..." />
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <InvoiceChart
                    type="pie"
                    data={{
                      labels: ["Paid", "Pending", "Overdue", "Draft"],
                      values: [
                        totalPaid,
                        totalPending,
                        totalOverdue,
                        invoices.filter((i) => i.status === "draft").reduce((sum, i) => sum + i.amount, 0),
                      ],
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Invoice Totals</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <InvoiceChart
                    type="bar"
                    data={{
                      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                      values: [35000, 42000, 37500, 45000, 52000, 48000],
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <InvoiceChart
                    type="line"
                    data={{
                      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                      datasets: [
                        {
                          label: "Invoiced",
                          values: [35000, 42000, 37500, 45000, 52000, 48000],
                        },
                        {
                          label: "Received",
                          values: [32000, 38000, 35000, 40000, 45000, 42000],
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
