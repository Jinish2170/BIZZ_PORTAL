"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Check, X, Download, Filter, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { FormField } from "@/components/form-validation"
import { z } from "zod"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Supplier {
  id: number
  name: string
  contact: string
  status: "active" | "inactive"
  category: string
  last_updated: string
}

export default function SuppliersPage() {
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    status: "active" as "active" | "inactive",
    category: "Technology",
  })

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/suppliers")
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch suppliers",
      })
    }
  }

  // Validation schemas
  const nameSchema = z.string().min(3, "Name must be at least 3 characters")
  const contactSchema = z.string().email("Must be a valid email address")

  const handleAddSupplier = async () => {
    try {
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to add supplier")

      await fetchSuppliers()
      setFormData({ name: "", contact: "", status: "active", category: "Technology" })
      setIsAddDialogOpen(false)

      toast({
        title: "Supplier added",
        description: "The supplier has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add supplier",
      })
    }
  }

  const handleEditSupplier = async () => {
    if (!currentSupplier) return

    try {
      const response = await fetch(`/api/suppliers/${currentSupplier.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update supplier")

      await fetchSuppliers()
      setFormData({ name: "", contact: "", status: "active", category: "Technology" })
      setIsEditDialogOpen(false)
      setCurrentSupplier(null)

      toast({
        title: "Supplier updated",
        description: "The supplier has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update supplier",
      })
    }
  }

  const handleDeleteSupplier = async (id: number) => {
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete supplier")

      await fetchSuppliers()

      toast({
        title: "Supplier deleted",
        description: "The supplier has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete supplier",
      })
    }
  }

  const openEditDialog = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      status: supplier.status,
      category: supplier.category,
    })
    setIsEditDialogOpen(true)
  }

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "contact",
      header: "Contact",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.getValue("category")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "success" : "secondary"}>
            {status === "active" ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditDialog(supplier)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this supplier? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteSupplier(supplier.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Calculate summary statistics
  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length
  const inactiveSuppliers = suppliers.filter((s) => s.status === "inactive").length

  // Group suppliers by category
  const suppliersByCategory = suppliers.reduce(
    (acc, supplier) => {
      acc[supplier.category] = (acc[supplier.category] || 0) + 1
      return acc
    },    {} as Record<string, number>,
  )

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
            <p className="text-muted-foreground">Manage your suppliers and their information</p>
          </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Supplier</DialogTitle>
                <DialogDescription>Add a new supplier to your business portal.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
                  validation={nameSchema}
                  required
                />
                <FormField
                  label="Contact (Email)"
                  name="contact"
                  value={formData.contact}
                  onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
                  validation={contactSchema}
                  required
                />
                <FormField
                  label="Category"
                  name="category"
                  type="select"
                  value={formData.category}
                  onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
                  selectOptions={[
                    { value: "Technology", label: "Technology" },
                    { value: "Manufacturing", label: "Manufacturing" },
                    { value: "Services", label: "Services" },
                    { value: "Healthcare", label: "Healthcare" },
                    { value: "Retail", label: "Retail" },
                  ]}
                  required
                />
                <FormField
                  label="Status"
                  name="status"
                  type="select"
                  value={formData.status}
                  onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
                  selectOptions={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },                  ]}
                  required
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSupplier}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSuppliers}</div>
              <p className="text-xs text-muted-foreground">
                {activeSuppliers} active, {inactiveSuppliers} inactive
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalSuppliers > 0 ? Math.round((activeSuppliers / totalSuppliers) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {activeSuppliers} out of {totalSuppliers} suppliers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.entries(suppliersByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.entries(suppliersByCategory).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} suppliers
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="mt-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Suppliers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <DataTable columns={columns} data={suppliers} searchPlaceholder="Search suppliers..." />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <DataTable
                  columns={columns}
                  data={suppliers.filter((s) => s.status === "active")}
                  searchPlaceholder="Search active suppliers..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <DataTable
                  columns={columns}
                  data={suppliers.filter((s) => s.status === "inactive")}
                  searchPlaceholder="Search inactive suppliers..."                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update the supplier information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormField
              label="Name"
              name="name"
              value={formData.name}
              onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
              validation={nameSchema}
              required
            />
            <FormField
              label="Contact (Email)"
              name="contact"
              value={formData.contact}
              onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
              validation={contactSchema}
              required
            />
            <FormField
              label="Category"
              name="category"
              type="select"
              value={formData.category}
              onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
              selectOptions={[
                { value: "Technology", label: "Technology" },
                { value: "Manufacturing", label: "Manufacturing" },
                { value: "Services", label: "Services" },
                { value: "Healthcare", label: "Healthcare" },
                { value: "Retail", label: "Retail" },
              ]}
              required
            />
            <FormField
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={(name, value) => setFormData((prev) => ({ ...prev, [name]: value }))}
              selectOptions={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSupplier}>Save Changes</Button>
          </DialogFooter>        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
