"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import { z } from "zod"
import { FormField } from "@/components/form-validation"

interface InvoiceFormProps {
  onSubmit: (data: any) => void
  initialData?: any
}

export function InvoiceForm({ onSubmit, initialData }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    client: initialData?.client || "",
    issueDate: initialData?.issueDate || new Date().toISOString().split("T")[0],
    dueDate:
      initialData?.dueDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],
    status: initialData?.status || "draft",
    items: initialData?.items || [{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }],
  })

  // Validation schemas
  const clientSchema = z.string().min(3, "Client name must be at least 3 characters")
  const descriptionSchema = z.string().min(3, "Description must be at least 3 characters")
  const quantitySchema = z.number().min(1, "Quantity must be at least 1")
  const priceSchema = z.number().min(0, "Price must be a positive number")

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]

    // Update the specific field
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }

    // Recalculate total if quantity or unitPrice changed
    if (field === "quantity" || field === "unitPrice") {
      const quantity = field === "quantity" ? Number(value) : Number(newItems[index].quantity)
      const unitPrice = field === "unitPrice" ? Number(value) : Number(newItems[index].unitPrice)
      newItems[index].total = quantity * unitPrice
    }

    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: String(prev.items.length + 1),
          description: "",
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ],
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return

    const newItems = [...formData.items]
    newItems.splice(index, 1)

    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }))
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + Number(item.total), 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would validate all fields here

    onSubmit({
      ...formData,
      amount: calculateTotal(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            label="Client"
            name="client"
            value={formData.client}
            onChange={(name, value) => handleChange(name, value)}
            validation={clientSchema}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleChange("issueDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Invoice Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>
                  ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (0%):</span>
                <span>$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Invoice Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-5">
                <Label htmlFor={`item-${index}-description`}>Description</Label>
                <Input
                  id={`item-${index}-description`}
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor={`item-${index}-quantity`}>Quantity</Label>
                <Input
                  id={`item-${index}-quantity`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor={`item-${index}-unitPrice`}>Unit Price</Label>
                <Input
                  id={`item-${index}-unitPrice`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, "unitPrice", Number(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor={`item-${index}-total`}>Total</Label>
                <Input id={`item-${index}-total`} type="number" value={item.total} readOnly className="bg-muted" />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Save Invoice</Button>
      </div>
    </form>
  )
}
