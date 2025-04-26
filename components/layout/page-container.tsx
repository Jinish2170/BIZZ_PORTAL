import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn("space-y-6 p-6", className)}>{children}</div>
}

interface PageHeaderProps {
  children: ReactNode
  className?: string
}

export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>{children}</div>
  )
}

interface PageHeaderHeadingProps {
  children: ReactNode
  className?: string
}

export function PageHeaderHeading({ children, className }: PageHeaderHeadingProps) {
  return (
    <div>
      <h1 className={cn("text-3xl font-bold tracking-tight", className)}>{children}</h1>
    </div>
  )
}

interface PageHeaderDescriptionProps {
  children: ReactNode
  className?: string
}

export function PageHeaderDescription({ children, className }: PageHeaderDescriptionProps) {
  return <p className={cn("text-muted-foreground", className)}>{children}</p>
}

interface PageActionsProps {
  children: ReactNode
  className?: string
}

export function PageActions({ children, className }: PageActionsProps) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>
}

interface PageContentProps {
  children: ReactNode
  className?: string
}

export function PageContent({ children, className }: PageContentProps) {
  return <div className={cn("space-y-6", className)}>{children}</div>
}

interface PageSectionProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export function PageSection({ children, className, title, description }: PageSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
