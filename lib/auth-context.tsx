"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useStore } from "./store"
import { useRouter } from "next/navigation"

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
    // Check if user is already authenticated by checking the cookie
    const cookies = document.cookie.split(";")
    const hasAuthCookie = cookies.some((cookie) => cookie.trim().startsWith("auth-state="))

    if (hasAuthCookie) {
      setIsAuthenticated(true)
      setCurrentUser({
        id: "user",
        name: "Demo User",
        email: "demo@example.com",
        role: "user"
      })
    }
  }, [setCurrentUser])

  const login = async (email: string, password: string) => {
    if (email && password) {
      setIsAuthenticated(true)
      // Set cookie with path=/ and secure flags
      document.cookie = "auth-state=true; path=/; secure"
      setCurrentUser({
        id: "user",
        name: "Demo User",
        email: email,
        role: "user"
      })
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    // Remove the auth cookie
    document.cookie = "auth-state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
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