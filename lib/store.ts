import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define types to match database schema
export interface Supplier {
  id: number
  name: string
  contact: string
  status: "active" | "inactive"
  category: string
  last_updated: string
}

export interface Budget {
  id: number
  name: string
  total_amount: string | number // MySQL DECIMAL comes as string
  spent_amount: string | number // MySQL DECIMAL comes as string
  department: string
  last_updated: string
}

export interface Document {
  id: number
  name: string
  type: string
  uploaded_by: string
  uploaded_date: string
  related_supplier_id?: number
  url: string
  size?: string
  last_updated: string
}

export interface Invoice {
  id: number
  supplier_id: number
  supplier_name?: string // For joined queries
  amount: string | number // MySQL DECIMAL comes as string
  status: "paid" | "unpaid" | "overdue"
  due_date: string
  issue_date: string
  description?: string
  last_updated: string
}

export interface AnalysisMetric {
  id: string
  name: string
  value: number
  previousValue: number
  change: number
  trend: "up" | "down" | "neutral"
  category: string
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

// Define the store state - now for caching API data
interface StoreState {
  // Cached data from API
  suppliers: Supplier[]
  budgets: Budget[]
  documents: Document[]
  invoices: Invoice[]
  metrics: AnalysisMetric[]
  currentUser: User | null

  // Loading states
  loading: {
    suppliers: boolean
    budgets: boolean
    documents: boolean
    invoices: boolean
  }

  // Actions for cache management
  setSuppliers: (suppliers: Supplier[]) => void
  setBudgets: (budgets: Budget[]) => void
  setDocuments: (documents: Document[]) => void
  setInvoices: (invoices: Invoice[]) => void
  setLoading: (entity: keyof StoreState['loading'], loading: boolean) => void
  setCurrentUser: (user: User | null) => void

  // Clear cache
  clearCache: () => void
}

// Some basic metrics for demo purposes (these could also come from API)
const defaultMetrics: AnalysisMetric[] = [
  {
    id: "1",
    name: "Total Revenue",
    value: 0,
    previousValue: 0,
    change: 0,
    trend: "neutral",
    category: "Financial",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    name: "Total Expenses",
    value: 0,
    previousValue: 0,
    change: 0,
    trend: "neutral",
    category: "Financial",
    date: new Date().toISOString().split("T")[0],
  },
]

// Create the store for caching API data
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial empty state
      suppliers: [],
      budgets: [],
      documents: [],
      invoices: [],
      metrics: defaultMetrics,
      currentUser: {
        id: "1",
        name: "Demo User",
        email: "demo@bizzportal.com",
        role: "admin",
      },

      loading: {
        suppliers: false,
        budgets: false,
        documents: false,
        invoices: false,
      },

      // Cache setters
      setSuppliers: (suppliers) => set({ suppliers }),
      setBudgets: (budgets) => set({ budgets }),
      setDocuments: (documents) => set({ documents }),
      setInvoices: (invoices) => set({ invoices }),
      
      setLoading: (entity, loading) =>
        set((state) => ({
          loading: { ...state.loading, [entity]: loading },
        })),

      setCurrentUser: (user) => set({ currentUser: user }),

      clearCache: () =>
        set({
          suppliers: [],
          budgets: [],
          documents: [],
          invoices: [],
        }),
    }),
    {
      name: "bizz-portal-storage",
    },
  ),
)
