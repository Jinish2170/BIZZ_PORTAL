import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"

// Define types for our data
export interface Supplier {
  id: string
  name: string
  contact: string
  status: "active" | "inactive"
  category: string
  lastUpdated: string
}

export interface Budget {
  id: string
  name: string
  totalAmount: number
  spentAmount: number
  department: string
  lastUpdated: string
}

export interface Document {
  id: string
  name: string
  uploadedBy: string
  uploadedDate: string
  type: string
  size: string
  tags: string[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  client: string
  amount: number
  status: "paid" | "pending" | "overdue" | "draft"
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
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

// Define the store state
interface StoreState {
  // Data
  suppliers: Supplier[]
  budgets: Budget[]
  documents: Document[]
  invoices: Invoice[]
  metrics: AnalysisMetric[]
  currentUser: User | null

  // Actions
  // Suppliers
  addSupplier: (supplier: Omit<Supplier, "id" | "lastUpdated">) => void
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void

  // Budgets
  addBudget: (budget: Omit<Budget, "id" | "lastUpdated">) => void
  updateBudget: (id: string, budget: Partial<Budget>) => void
  deleteBudget: (id: string) => void

  // Documents
  addDocument: (document: Omit<Document, "id" | "uploadedDate">) => void
  updateDocument: (id: string, document: Partial<Document>) => void
  deleteDocument: (id: string) => void

  // Invoices
  addInvoice: (invoice: Omit<Invoice, "id">) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void

  // Metrics
  addMetric: (metric: Omit<AnalysisMetric, "id">) => void
  updateMetric: (id: string, metric: Partial<AnalysisMetric>) => void
  deleteMetric: (id: string) => void

  // User
  setCurrentUser: (user: User | null) => void
}

// Sample data
const sampleSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Acme Inc.",
    contact: "contact@acme.com",
    status: "active",
    category: "Manufacturing",
    lastUpdated: "2025-01-15",
  },
  {
    id: "2",
    name: "Globex Corp",
    contact: "info@globex.com",
    status: "active",
    category: "Technology",
    lastUpdated: "2025-02-03",
  },
  {
    id: "3",
    name: "Initech",
    contact: "support@initech.com",
    status: "inactive",
    category: "Services",
    lastUpdated: "2025-01-28",
  },
  {
    id: "4",
    name: "Umbrella Corp",
    contact: "info@umbrella.com",
    status: "active",
    category: "Healthcare",
    lastUpdated: "2025-02-10",
  },
  {
    id: "5",
    name: "Stark Industries",
    contact: "info@stark.com",
    status: "active",
    category: "Technology",
    lastUpdated: "2025-02-15",
  },
  {
    id: "6",
    name: "Wayne Enterprises",
    contact: "contact@wayne.com",
    status: "active",
    category: "Manufacturing",
    lastUpdated: "2025-01-20",
  },
  {
    id: "7",
    name: "Cyberdyne Systems",
    contact: "info@cyberdyne.com",
    status: "inactive",
    category: "Technology",
    lastUpdated: "2025-01-05",
  },
]

const sampleBudgets: Budget[] = [
  {
    id: "1",
    name: "Marketing Campaign",
    totalAmount: 25000,
    spentAmount: 15000,
    department: "Marketing",
    lastUpdated: "2025-01-15",
  },
  {
    id: "2",
    name: "Office Supplies",
    totalAmount: 35000,
    spentAmount: 28000,
    department: "Operations",
    lastUpdated: "2025-02-03",
  },
  {
    id: "3",
    name: "Software Licenses",
    totalAmount: 20000,
    spentAmount: 12000,
    department: "IT",
    lastUpdated: "2025-01-28",
  },
  {
    id: "4",
    name: "Employee Training",
    totalAmount: 10000,
    spentAmount: 8000,
    department: "HR",
    lastUpdated: "2025-02-10",
  },
  {
    id: "5",
    name: "Product Development",
    totalAmount: 10000,
    spentAmount: 5000,
    department: "R&D",
    lastUpdated: "2025-02-15",
  },
  {
    id: "6",
    name: "Client Events",
    totalAmount: 15000,
    spentAmount: 7500,
    department: "Marketing",
    lastUpdated: "2025-01-20",
  },
  {
    id: "7",
    name: "Infrastructure",
    totalAmount: 30000,
    spentAmount: 22000,
    department: "IT",
    lastUpdated: "2025-01-05",
  },
]

const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "Q1 Financial Report.pdf",
    uploadedBy: "John Doe",
    uploadedDate: "2025-01-15",
    type: "pdf",
    size: "2.4 MB",
    tags: ["Financial", "Report"],
  },
  {
    id: "2",
    name: "Marketing Strategy.docx",
    uploadedBy: "Jane Smith",
    uploadedDate: "2025-02-03",
    type: "docx",
    size: "1.8 MB",
    tags: ["Marketing", "Strategy"],
  },
  {
    id: "3",
    name: "Supplier Agreement.pdf",
    uploadedBy: "Mike Johnson",
    uploadedDate: "2025-02-10",
    type: "pdf",
    size: "3.2 MB",
    tags: ["Legal", "Supplier"],
  },
  {
    id: "4",
    name: "Budget Forecast.xlsx",
    uploadedBy: "Sarah Williams",
    uploadedDate: "2025-02-22",
    type: "xlsx",
    size: "1.5 MB",
    tags: ["Financial", "Budget"],
  },
  {
    id: "5",
    name: "Product Mockups.png",
    uploadedBy: "David Chen",
    uploadedDate: "2025-02-18",
    type: "png",
    size: "4.7 MB",
    tags: ["Design", "Product"],
  },
  {
    id: "6",
    name: "Employee Handbook.pdf",
    uploadedBy: "Lisa Taylor",
    uploadedDate: "2025-01-28",
    type: "pdf",
    size: "5.1 MB",
    tags: ["HR", "Policy"],
  },
  {
    id: "7",
    name: "Sales Presentation.pptx",
    uploadedBy: "Robert Johnson",
    uploadedDate: "2025-02-05",
    type: "pptx",
    size: "8.3 MB",
    tags: ["Sales", "Presentation"],
  },
]

const sampleInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    client: "Acme Inc.",
    amount: 5250.0,
    status: "paid",
    issueDate: "2025-02-15",
    dueDate: "2025-03-15",
    items: [
      {
        id: "item1",
        description: "Web Development Services",
        quantity: 1,
        unitPrice: 4500.0,
        total: 4500.0,
      },
      {
        id: "item2",
        description: "Hosting (Monthly)",
        quantity: 3,
        unitPrice: 250.0,
        total: 750.0,
      },
    ],
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    client: "Globex Corp",
    amount: 8750.0,
    status: "pending",
    issueDate: "2025-02-20",
    dueDate: "2025-03-20",
    items: [
      {
        id: "item1",
        description: "Software Development",
        quantity: 1,
        unitPrice: 7500.0,
        total: 7500.0,
      },
      {
        id: "item2",
        description: "Support Hours",
        quantity: 5,
        unitPrice: 250.0,
        total: 1250.0,
      },
    ],
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    client: "Initech",
    amount: 3200.0,
    status: "overdue",
    issueDate: "2025-01-25",
    dueDate: "2025-02-25",
    items: [
      {
        id: "item1",
        description: "UI/UX Design",
        quantity: 1,
        unitPrice: 3200.0,
        total: 3200.0,
      },
    ],
  },
  {
    id: "4",
    invoiceNumber: "INV-2025-004",
    client: "Umbrella Corp",
    amount: 12500.0,
    status: "paid",
    issueDate: "2025-02-10",
    dueDate: "2025-03-10",
    items: [
      {
        id: "item1",
        description: "Custom Software Development",
        quantity: 1,
        unitPrice: 10000.0,
        total: 10000.0,
      },
      {
        id: "item2",
        description: "Training Sessions",
        quantity: 5,
        unitPrice: 500.0,
        total: 2500.0,
      },
    ],
  },
  {
    id: "5",
    invoiceNumber: "INV-2025-005",
    client: "Stark Industries",
    amount: 7800.0,
    status: "draft",
    issueDate: "2025-03-01",
    dueDate: "2025-04-01",
    items: [
      {
        id: "item1",
        description: "Consulting Services",
        quantity: 1,
        unitPrice: 7800.0,
        total: 7800.0,
      },
    ],
  },
  {
    id: "6",
    invoiceNumber: "INV-2025-006",
    client: "Wayne Enterprises",
    amount: 15000.0,
    status: "pending",
    issueDate: "2025-02-28",
    dueDate: "2025-03-28",
    items: [
      {
        id: "item1",
        description: "Security System Implementation",
        quantity: 1,
        unitPrice: 12000.0,
        total: 12000.0,
      },
      {
        id: "item2",
        description: "Maintenance Contract",
        quantity: 1,
        unitPrice: 3000.0,
        total: 3000.0,
      },
    ],
  },
  {
    id: "7",
    invoiceNumber: "INV-2025-007",
    client: "Cyberdyne Systems",
    amount: 9500.0,
    status: "paid",
    issueDate: "2025-02-05",
    dueDate: "2025-03-05",
    items: [
      {
        id: "item1",
        description: "AI Integration Services",
        quantity: 1,
        unitPrice: 8000.0,
        total: 8000.0,
      },
      {
        id: "item2",
        description: "API Development",
        quantity: 1,
        unitPrice: 1500.0,
        total: 1500.0,
      },
    ],
  },
]

const sampleMetrics: AnalysisMetric[] = [
  {
    id: "1",
    name: "Total Revenue",
    value: 125000,
    previousValue: 110000,
    change: 13.64,
    trend: "up",
    category: "Financial",
    date: "2025-03-01",
  },
  {
    id: "2",
    name: "Total Expenses",
    value: 85000,
    previousValue: 78000,
    change: 8.97,
    trend: "up",
    category: "Financial",
    date: "2025-03-01",
  },
  {
    id: "3",
    name: "Net Profit",
    value: 40000,
    previousValue: 32000,
    change: 25.0,
    trend: "up",
    category: "Financial",
    date: "2025-03-01",
  },
  {
    id: "4",
    name: "Supplier Costs",
    value: 45000,
    previousValue: 42000,
    change: 7.14,
    trend: "up",
    category: "Suppliers",
    date: "2025-03-01",
  },
  {
    id: "5",
    name: "Marketing ROI",
    value: 3.2,
    previousValue: 2.8,
    change: 14.29,
    trend: "up",
    category: "Marketing",
    date: "2025-03-01",
  },
  {
    id: "6",
    name: "Customer Acquisition Cost",
    value: 250,
    previousValue: 275,
    change: -9.09,
    trend: "down",
    category: "Marketing",
    date: "2025-03-01",
  },
  {
    id: "7",
    name: "Average Order Value",
    value: 1250,
    previousValue: 1150,
    change: 8.7,
    trend: "up",
    category: "Sales",
    date: "2025-03-01",
  },
  {
    id: "8",
    name: "Inventory Turnover",
    value: 5.8,
    previousValue: 5.2,
    change: 11.54,
    trend: "up",
    category: "Operations",
    date: "2025-03-01",
  },
]

// Create the store
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      suppliers: sampleSuppliers,
      budgets: sampleBudgets,
      documents: sampleDocuments,
      invoices: sampleInvoices,
      metrics: sampleMetrics,
      currentUser: {
        id: "1",
        name: "Demo User",
        email: "demo@bizzportal.com",
        role: "admin",
      },

      // Supplier actions
      addSupplier: (supplier) =>
        set((state) => ({
          suppliers: [
            ...state.suppliers,
            {
              ...supplier,
              id: uuidv4(),
              lastUpdated: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateSupplier: (id, supplier) =>
        set((state) => ({
          suppliers: state.suppliers.map((s) =>
            s.id === id
              ? {
                  ...s,
                  ...supplier,
                  lastUpdated: new Date().toISOString().split("T")[0],
                }
              : s,
          ),
        })),

      deleteSupplier: (id) =>
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id),
        })),

      // Budget actions
      addBudget: (budget) =>
        set((state) => ({
          budgets: [
            ...state.budgets,
            {
              ...budget,
              id: uuidv4(),
              lastUpdated: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateBudget: (id, budget) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id
              ? {
                  ...b,
                  ...budget,
                  lastUpdated: new Date().toISOString().split("T")[0],
                }
              : b,
          ),
        })),

      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      // Document actions
      addDocument: (document) =>
        set((state) => ({
          documents: [
            ...state.documents,
            {
              ...document,
              id: uuidv4(),
              uploadedDate: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateDocument: (id, document) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id
              ? {
                  ...d,
                  ...document,
                }
              : d,
          ),
        })),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),

      // Invoice actions
      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [
            ...state.invoices,
            {
              ...invoice,
              id: uuidv4(),
            },
          ],
        })),

      updateInvoice: (id, invoice) =>
        set((state) => ({
          invoices: state.invoices.map((i) =>
            i.id === id
              ? {
                  ...i,
                  ...invoice,
                }
              : i,
          ),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((i) => i.id !== id),
        })),

      updateInvoiceStatus: (id, status) =>
        set((state) => ({
          invoices: state.invoices.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status,
                }
              : i,
          ),
        })),

      // Metric actions
      addMetric: (metric) =>
        set((state) => ({
          metrics: [
            ...state.metrics,
            {
              ...metric,
              id: uuidv4(),
            },
          ],
        })),

      updateMetric: (id, metric) =>
        set((state) => ({
          metrics: state.metrics.map((m) =>
            m.id === id
              ? {
                  ...m,
                  ...metric,
                }
              : m,
          ),
        })),

      deleteMetric: (id) =>
        set((state) => ({
          metrics: state.metrics.filter((m) => m.id !== id),
        })),

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "bizz-portal-storage",
    },
  ),
)
