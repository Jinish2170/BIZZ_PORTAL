"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useStore } from "./store"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { setCurrentUser } = useStore()
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const authState = Cookies.get("auth-state")
    if (authState) {
      setIsAuthenticated(true)
      setCurrentUser({
        id: "admin",
        name: "Admin User",
        email: "admin@gmail.com",
        role: "admin"
      })
    }
  }, [setCurrentUser])

  const login = async (email: string, password: string) => {
    // Hardcoded admin credentials
    if (email === "admin@gmail.com" && password === "admin123") {
      setIsAuthenticated(true)
      Cookies.set("auth-state", "true", { path: "/" })
      setCurrentUser({
        id: "admin",
        name: "Admin User",
        email: "admin@gmail.com",
        role: "admin"
      })
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    Cookies.remove("auth-state", { path: "/" })
    setCurrentUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}