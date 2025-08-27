# 🏢 BizzPortal - Business Management Platform

A comprehensive, modern business management platform built with Next.js 15, React 19, and TypeScript. BizzPortal streamlines your business operations with powerful tools for managing invoices, suppliers, budgets, documents, and analytics.

![BizzPortal Dashboard](./public/dashboard-preview.png)

## ✨ Features

### 📊 **Dashboard & Analytics**
- Real-time business metrics and KPIs
- Interactive charts and visualizations
- Cash flow trends analysis
- Performance monitoring
- Recent activity tracking
- Task management and reminders

### 🧾 **Invoice Management**
- Create, edit, and manage invoices
- Invoice upload and processing
- Payment tracking and due dates
- Automated invoice generation
- Export capabilities

### 🏭 **Supplier Management**
- Comprehensive supplier database
- Supplier performance tracking
- Contact information management
- Supplier statistics and analytics
- Vendor relationship management

### 💰 **Budget Management**
- Budget allocation and planning
- Spending tracking and analysis
- Budget vs actual comparisons
- Financial forecasting
- Cost center management

### 📁 **Document Management**
- Secure document storage
- File upload and organization
- Document categorization
- Search and retrieval system
- Version control

### 🔐 **Authentication & Security**
- User authentication system
- Role-based access control
- Secure session management
- Protected API routes

### 🎨 **User Experience**
- Modern, responsive design
- Dark/Light theme support
- Accessible UI components
- Real-time updates
- Interactive data tables
- Toast notifications

## 🛠 Technology Stack

### **Frontend**
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Radix UI** - Accessible primitives
- **Framer Motion** - Smooth animations

### **Backend**
- **Next.js API Routes** - Server-side API endpoints
- **MySQL2** - Database connectivity
- **bcrypt** - Password hashing
- **Zod** - Schema validation

### **Data & State Management**
- **Zustand** - Lightweight state management
- **TanStack Table** - Powerful data tables
- **React Hook Form** - Form handling
- **React Query/TanStack Query** - Server state management

### **Charts & Visualization**
- **Chart.js** - Flexible charting library
- **React Chartjs 2** - React wrapper for Chart.js
- **Recharts** - Composable charting library

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Jinish2170/DE_BIZZ_PORTAL.git
cd DE_BIZZ_PORTAL
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
# or
pnpm install --shamefully-hoist
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=bizz_portal2

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Application Settings
NODE_ENV=development
```

### 4. Database Setup
1. Create a MySQL database named `bizz_portal2`
2. Update the database configuration in `lib/db.ts`:
```typescript
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'your_password',
  database: process.env.MYSQL_DATABASE || 'bizz_portal2',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### 5. Run the Development Server
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
DE_BIZZ_PORTAL/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 analysis/           # Analytics pages
│   ├── 📁 api/                # API routes
│   │   ├── 📁 budgets/        # Budget API endpoints
│   │   ├── 📁 documents/      # Document API endpoints
│   │   ├── 📁 invoices/       # Invoice API endpoints
│   │   └── 📁 suppliers/      # Supplier API endpoints
│   ├── 📁 budgets/            # Budget management pages
│   ├── 📁 documents/          # Document management pages
│   ├── 📁 invoices/           # Invoice management pages
│   ├── 📁 login/              # Authentication pages
│   ├── 📁 suppliers/          # Supplier management pages
│   ├── layout.tsx             # Root layout component
│   ├── page.tsx               # Dashboard page
│   └── globals.css            # Global styles
├── 📁 components/             # Reusable UI components
│   ├── 📁 dashboard/          # Dashboard-specific components
│   ├── 📁 invoices/           # Invoice-specific components
│   ├── 📁 layout/             # Layout components
│   └── 📁 ui/                 # Base UI components (shadcn/ui)
├── 📁 hooks/                  # Custom React hooks
├── 📁 lib/                    # Utility libraries
│   ├── auth-context.tsx       # Authentication context
│   ├── db.ts                  # Database connection
│   ├── store.ts               # State management
│   └── utils.ts               # Utility functions
├── 📁 public/                 # Static assets
├── 📁 styles/                 # Additional stylesheets
├── components.json            # shadcn/ui configuration
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev          # Start development server

# Production build
npm run build        # Build for production
npm run start        # Start production server

# Code quality
npm run lint         # Run ESLint
```

### Building for Production

```bash
npm run build
npm run start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🔌 API Routes

The application includes several API endpoints:

- `GET/POST /api/budgets` - Budget management
- `GET/POST /api/documents` - Document operations
- `GET/POST /api/invoices` - Invoice management
- `POST /api/invoices/upload` - Invoice file uploads
- `GET/POST /api/suppliers` - Supplier management

For detailed API documentation, see [API.md](./API.md).

## 🎯 Key Features Guide

### Dashboard
Navigate to the main dashboard to view:
- Business metrics overview
- Recent activity feed
- Upcoming payment reminders
- Performance charts and KPIs

### Invoice Management
1. Go to `/invoices` to manage invoices
2. Create new invoices or upload existing ones
3. Track payment statuses and due dates
4. Generate reports and analytics

### Supplier Management
1. Visit `/suppliers` to manage vendor information
2. Add, edit, or remove supplier details
3. Track supplier performance metrics
4. Manage supplier relationships

### Budget Planning
1. Access `/budgets` for financial planning
2. Set budget allocations by category
3. Monitor spending vs budget
4. Generate budget reports

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure components are accessible
- Write clear commit messages
- Test your changes thoroughly

## 🚨 Troubleshooting

### Common Issues

**1. Dependency Installation Errors**
```bash
# Try installing with legacy peer deps
npm install --legacy-peer-deps
```

**2. Database Connection Issues**
- Verify MySQL is running
- Check database credentials in `lib/db.ts`
- Ensure database `bizz_portal2` exists

**3. Build Errors**
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

**4. Port Already in Use**
```bash
# Kill process using port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Getting Help
- Check existing [GitHub Issues](https://github.com/Jinish2170/DE_BIZZ_PORTAL/issues)
- Create a new issue with detailed description
- Review the [DEVELOPMENT.md](./DEVELOPMENT.md) file

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Vercel** for the deployment platform
- **shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible design primitives

## 📞 Support

For support and questions:
- 📧 Email: [Your Email]
- 🐛 Issues: [GitHub Issues](https://github.com/Jinish2170/DE_BIZZ_PORTAL/issues)
- 📖 Documentation: [Wiki](https://github.com/Jinish2170/DE_BIZZ_PORTAL/wiki)

---

**Built with ❤️ using Next.js and TypeScript**