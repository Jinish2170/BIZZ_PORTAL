"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string | number
  onChange: (name: string, value: string | number) => void
  validation?: z.ZodType<any>
  required?: boolean
  className?: string
  selectOptions?: { value: string; label: string }[]
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  validation,
  required = false,
  className,
  selectOptions,
}: FormFieldProps) {
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === "number" ? Number.parseFloat(e.target.value) || 0 : e.target.value
    onChange(name, newValue)
    validateField(newValue)
  }

  const handleSelectChange = (newValue: string) => {
    onChange(name, newValue)
    validateField(newValue)
  }

  const validateField = (fieldValue: any) => {
    if (!validation) return

    try {
      validation.parse(fieldValue)
      setError(null)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError("Invalid input")
      }
    }
  }

  const handleBlur = () => {
    setTouched(true)
    validateField(value)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      {type === "select" && selectOptions ? (
        <Select value={value as string} onValueChange={handleSelectChange} onOpenChange={() => setTouched(true)}>
          <SelectTrigger id={name} className={error && touched ? "border-red-500" : ""}>
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={error && touched ? "border-red-500" : ""}
        />
      )}

      {error && touched && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
