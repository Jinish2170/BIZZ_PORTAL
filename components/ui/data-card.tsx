import type React from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const dataCardVariants = cva("transition-all duration-200 ease-in-out", {
  variants: {
    variant: {
      default: "bg-card hover:bg-card/90",
      primary: "bg-primary/10 text-primary hover:bg-primary/15",
      success:
        "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30",
      warning:
        "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
      destructive:
        "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30",
      info: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
    size: {
      default: "p-6",
      sm: "p-4",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface DataCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dataCardVariants> {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  footer?: React.ReactNode
  isLoading?: boolean
}

export function DataCard({
  className,
  variant,
  size,
  title,
  value,
  icon,
  trend,
  footer,
  isLoading = false,
  ...props
}: DataCardProps) {
  return (
    <Card className={cn(dataCardVariants({ variant, size }), "border", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4">{icon}</div>}
      </CardHeader>
\
