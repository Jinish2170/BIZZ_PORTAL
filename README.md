# BizzPortal - Business Management Platform

BizzPortal is a comprehensive business management platform built with Next.js, TypeScript, and MySQL. It provides functionality for managing suppliers, invoices, budgets, documents, and analytics.

## Features

- 🔐 Secure Authentication System
- 👥 Supplier Management
- 💰 Invoice Tracking
- 📊 Budget Management
- 📄 Document Management
- 📈 Analytics & Reporting
- 🎯 Business Analysis
- 🌓 Dark/Light Theme
- 📱 Responsive Design

## Tech Stack

- **Frontend:**
  - Next.js 14+
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui Components
  - Framer Motion
  - Chart.js

- **Backend:**
  - MySQL Database
  - Drizzle ORM
  - Next.js API Routes

- **Authentication:**
  - Custom JWT-based auth
  - Role-based access control

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- MySQL Server

## Installation

1. Clone the repository:
\```bash
git clone <repository-url>
cd DE_BIZZ_PORTAL
\```

2. Install dependencies:
\```bash
pnpm install
\```

3. Set up the database:
- Make sure MySQL Server is running
- Create a database named 'bizz_portal'
- Run the initialization script:
\```bash
pnpm ts-node scripts/init-db.ts
\```

4. Start the development server:
\```bash
pnpm dev
\```

5. Access the application at http://localhost:3000

## Default Admin Credentials

- Email: admin@gmail.com
- Password: admin123

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable React components
  - `/ui` - Basic UI components
  - `/dashboard` - Dashboard-specific components
  - `/layout` - Layout components
  - `/invoices` - Invoice-related components
- `/lib` - Utility functions and configurations
- `/public` - Static assets
- `/styles` - Global styles
- `/scripts` - Database and utility scripts

## Database Schema

### Users Table
- id (VARCHAR(36)) - Primary Key
- name (VARCHAR(255))
- email (VARCHAR(255))
- password (VARCHAR(255))
- role (ENUM('admin', 'user'))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Suppliers Table
- id (VARCHAR(36)) - Primary Key
- name (VARCHAR(255))
- contact (VARCHAR(255))
- status (ENUM('active', 'inactive'))
- category (VARCHAR(100))
- last_updated (TIMESTAMP)

### Budgets Table
- id (VARCHAR(36)) - Primary Key
- name (VARCHAR(255))
- amount (DECIMAL(10,2))
- spent (DECIMAL(10,2))
- category (VARCHAR(100))
- status (ENUM('active', 'completed', 'cancelled'))
- start_date (TIMESTAMP)
- end_date (TIMESTAMP)
- last_updated (TIMESTAMP)

### Documents Table
- id (VARCHAR(36)) - Primary Key
- name (VARCHAR(255))
- type (VARCHAR(50))
- size (DECIMAL(10,2))
- url (VARCHAR(512))
- uploaded_by (VARCHAR(36)) - Foreign Key to users.id
- uploaded_date (TIMESTAMP)
- category (VARCHAR(100))

### Invoices Table
- id (VARCHAR(36)) - Primary Key
- number (VARCHAR(50))
- supplier_id (VARCHAR(36)) - Foreign Key to suppliers.id
- amount (DECIMAL(10,2))
- status (ENUM('draft', 'pending', 'paid', 'cancelled'))
- due_date (TIMESTAMP)
- issued_date (TIMESTAMP)
- paid_date (TIMESTAMP)
- notes (TEXT)
- created_by (VARCHAR(36)) - Foreign Key to users.id
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Key Features Documentation

### Authentication System
- JWT-based authentication
- Protected routes using middleware
- Role-based access control (Admin/User)
- Secure password hashing
- Session management with cookies

### Supplier Management
- Add/Edit/Delete suppliers
- Filter suppliers by status and category
- Search functionality
- Supplier activity tracking
- Supplier performance metrics

### Invoice Management
- Create and manage invoices
- Link invoices to suppliers
- Track payment status
- Due date reminders
- Invoice analytics
- Export functionality

### Budget Management
- Create and track budgets
- Category-based organization
- Spending analytics
- Budget vs actual comparison
- Alert system for overspending

### Document Management
- Secure document upload
- Document categorization
- Search and filter documents
- Access control
- Version tracking

### Analytics & Reporting
- Real-time dashboard
- Financial metrics
- Supplier performance
- Budget analysis
- Custom report generation
- Interactive charts and graphs

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Implement proper error handling
- Write meaningful comments
- Follow component-based architecture

### Best Practices
- Keep components small and focused
- Use proper TypeScript types
- Implement error boundaries
- Follow React hooks best practices
- Optimize database queries
- Implement proper loading states
- Handle edge cases

### Performance Optimization
- Implement code splitting
- Use proper caching strategies
- Optimize database queries
- Implement proper indexing
- Use proper image optimization
- Implement lazy loading

## Security Measures

- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure password storage
- Role-based access control
- Rate limiting
- Data encryption

## Error Handling

- Proper error boundaries
- User-friendly error messages
- Proper logging
- Fallback UI components
- Network error handling
- Database error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@bizzportal.com