"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { FormField } from "@/components/form-validation"

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void
  initialData?: Partial<InvoiceFormData>
}

interface Supplier {
  id: number
  name: string
}

// Match the database schema exactly
interface InvoiceFormData {
  supplier_id: number
  amount: number
  status: 'paid' | 'unpaid' | 'overdue'
  due_date: string
  issue_date: string
  description?: string
}

export function InvoiceForm({ onSubmit, initialData }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    supplier_id: initialData?.supplier_id || 0,
    amount: initialData?.amount || 0,
    status: initialData?.status || 'unpaid',
    issue_date: initialData?.issue_date || new Date().toISOString().split('T')[0],
    due_date: initialData?.due_date || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    description: initialData?.description || ''
  })

  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers')
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    }
  }

  // Validation schemas
  const supplierSchema = z.number().min(1, "Supplier is required")
  const amountSchema = z.number().min(0.01, "Amount must be greater than 0")
  const statusSchema = z.enum(['paid', 'unpaid', 'overdue'])
  const dateSchema = z.string().min(1, "Date is required")

  const handleChange = (name: keyof InvoiceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            label="Supplier"
            name="supplier_id"
            type="select"
            value={String(formData.supplier_id)}
            onChange={(name, value) => handleChange(name as keyof InvoiceFormData, Number(value))}
            selectOptions={suppliers.map(s => ({ value: String(s.id), label: s.name }))}
            validation={supplierSchema}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => handleChange("amount", Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issue_date}
                onChange={(e) => handleChange("issue_date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange("due_date", e.target.value)}
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
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Invoice description"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Invoice</Button>
      </div>
    </form>
  )
}
