# API Documentation

BizzPortal provides a RESTful API for managing business operations. All API endpoints are built using Next.js API routes and return JSON responses.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most API endpoints require authentication. Include the authentication token in your requests:
```
Authorization: Bearer YOUR_TOKEN
```

## Endpoints

### Budgets API

#### Get All Budgets
```http
GET /api/budgets
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Marketing Budget",
      "allocated": 10000,
      "spent": 7500,
      "category": "marketing",
      "period": "2024-Q1"
    }
  ]
}
```

#### Create Budget
```http
POST /api/budgets
```

**Request Body:**
```json
{
  "name": "New Budget",
  "allocated": 15000,
  "category": "operations",
  "period": "2024-Q1"
}
```

### Suppliers API

#### Get All Suppliers
```http
GET /api/suppliers
```

#### Create Supplier
```http
POST /api/suppliers
```

**Request Body:**
```json
{
  "name": "Supplier Name",
  "email": "supplier@example.com",
  "phone": "+1234567890",
  "address": "123 Business St"
}
```

### Invoices API

#### Get All Invoices
```http
GET /api/invoices
```

#### Create Invoice
```http
POST /api/invoices
```

#### Upload Invoice File
```http
POST /api/invoices/upload
```

**Request:** Multipart form data with file

### Documents API

#### Get All Documents
```http
GET /api/documents
```

#### Upload Document
```http
POST /api/documents
```

## Error Handling

API errors return appropriate HTTP status codes and error messages:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:
- 1000 requests per hour per IP
- 100 requests per minute per authenticated user

## Examples

### JavaScript/TypeScript
```javascript
const response = await fetch('/api/budgets', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

### cURL
```bash
curl -X GET "http://localhost:3000/api/budgets" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```