"use client"

import type React from "react"

import { useState, useCallback } from "react"

type ToastType = "default" | "destructive"

interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  type?: ToastType
}

interface ToastOptions {
  title?: string
  description?: string
  action?: React.ReactNode
  type?: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, action, type = "default" }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, action, type }

    setToasts((prevToasts) => [...prevToasts, newToast])

    return {
      id,
      dismiss: () => setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id)),
      update: (options: ToastOptions) =>
        setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === id ? { ...toast, ...options } : toast))),
    }
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}
