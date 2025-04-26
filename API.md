# BizzPortal API Documentation

## Authentication Endpoints

### POST /api/auth/login
Login with email and password
```typescript
{
  email: string;
  password: string;
}
```
Returns: JWT token and user data

### POST /api/auth/logout
Logs out the current user
Returns: Success message

## Supplier Endpoints

### GET /api/suppliers
Get all suppliers
Query parameters:
- status?: 'active' | 'inactive'
- category?: string
- search?: string
- page?: number
- limit?: number

### GET /api/suppliers/:id
Get supplier by ID

### POST /api/suppliers
Create new supplier
```typescript
{
  name: string;
  contact: string;
  status: 'active' | 'inactive';
  category: string;
}
```

### PUT /api/suppliers/:id
Update supplier
```typescript
{
  name?: string;
  contact?: string;
  status?: 'active' | 'inactive';
  category?: string;
}
```

### DELETE /api/suppliers/:id
Delete supplier

## Invoice Endpoints

### GET /api/invoices
Get all invoices
Query parameters:
- status?: 'draft' | 'pending' | 'paid' | 'cancelled'
- supplierId?: string
- startDate?: string
- endDate?: string
- page?: number
- limit?: number

### GET /api/invoices/:id
Get invoice by ID

### POST /api/invoices
Create new invoice
```typescript
{
  number: string;
  supplierId: string;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'cancelled';
  dueDate: string;
  issuedDate: string;
  notes?: string;
}
```

### PUT /api/invoices/:id
Update invoice
```typescript
{
  status?: 'draft' | 'pending' | 'paid' | 'cancelled';
  dueDate?: string;
  notes?: string;
  paidDate?: string;
}
```

### DELETE /api/invoices/:id
Delete invoice

## Budget Endpoints

### GET /api/budgets
Get all budgets
Query parameters:
- status?: 'active' | 'completed' | 'cancelled'
- category?: string
- page?: number
- limit?: number

### GET /api/budgets/:id
Get budget by ID

### POST /api/budgets
Create new budget
```typescript
{
  name: string;
  amount: number;
  category: string;
  startDate: string;
  endDate: string;
}
```

### PUT /api/budgets/:id
Update budget
```typescript
{
  name?: string;
  amount?: number;
  spent?: number;
  category?: string;
  status?: 'active' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
}
```

### DELETE /api/budgets/:id
Delete budget

## Document Endpoints

### GET /api/documents
Get all documents
Query parameters:
- category?: string
- type?: string
- search?: string
- page?: number
- limit?: number

### GET /api/documents/:id
Get document by ID

### POST /api/documents
Upload new document (multipart/form-data)
```typescript
{
  file: File;
  name: string;
  category: string;
}
```

### PUT /api/documents/:id
Update document metadata
```typescript
{
  name?: string;
  category?: string;
}
```

### DELETE /api/documents/:id
Delete document

## Analytics Endpoints

### GET /api/analytics/dashboard
Get dashboard analytics data
Returns:
- Total suppliers count
- Active suppliers count
- Total invoices amount
- Pending invoices amount
- Budget utilization
- Recent activities

### GET /api/analytics/suppliers
Get supplier analytics
Returns:
- Supplier distribution by category
- Supplier status distribution
- Top suppliers by invoice amount
- Supplier growth trend

### GET /api/analytics/invoices
Get invoice analytics
Returns:
- Monthly invoice totals
- Payment status distribution
- Average payment time
- Top invoice categories

### GET /api/analytics/budgets
Get budget analytics
Returns:
- Budget vs actual spending
- Category-wise budget allocation
- Monthly budget trends
- Budget status distribution

## Response Format

All API responses follow this format:
```typescript
{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

## Error Codes

- AUTH_001: Invalid credentials
- AUTH_002: Token expired
- AUTH_003: Invalid token
- AUTH_004: Unauthorized access
- VAL_001: Validation error
- DB_001: Database error
- FILE_001: File upload error
- NOT_FOUND: Resource not found
- SERVER_ERROR: Internal server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Authentication

All API endpoints (except login) require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Data Validation

Request data is validated using Zod schemas. Validation errors return:
- Status code: 400
- Error code: VAL_001
- Detailed validation messages