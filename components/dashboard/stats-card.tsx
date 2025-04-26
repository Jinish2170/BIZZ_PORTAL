import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  description: string
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function StatsCard({ title, value, description, trend = "neutral", className }: StatsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend === "up" && <ArrowUp className="h-4 w-4 text-emerald-500" />}
        {trend === "down" && <ArrowDown className="h-4 w-4 text-rose-500" />}
        {trend === "neutral" && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={cn(
            "text-xs",
            trend === "up" && "text-emerald-500",
            trend === "down" && "text-rose-500",
            trend === "neutral" && "text-muted-foreground",
          )}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
