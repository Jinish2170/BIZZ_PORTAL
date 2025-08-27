# Development Guide

This guide covers the development setup, conventions, and workflows for the BizzPortal project.

## 🔧 Development Environment Setup

### Prerequisites
- Node.js v18.0.0 or higher
- MySQL 8.0 or higher
- Git
- VS Code (recommended) with these extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Auto Rename Tag

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/Jinish2170/DE_BIZZ_PORTAL.git
   cd DE_BIZZ_PORTAL
   npm install --legacy-peer-deps
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Database Setup**
   ```sql
   CREATE DATABASE bizz_portal2;
   -- Run migration scripts if available
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Architecture

### Directory Structure

```
app/                    # Next.js 13+ App Router
├── (auth)/            # Route groups for authentication
├── analysis/          # Analytics and reporting pages
├── api/               # API routes
├── budgets/           # Budget management
├── documents/         # Document management
├── invoices/          # Invoice management
├── suppliers/         # Supplier management
├── layout.tsx         # Root layout
└── page.tsx          # Home/Dashboard page

components/            # Reusable UI components
├── dashboard/         # Dashboard-specific components
├── invoices/          # Invoice-related components
├── layout/            # Layout components
└── ui/               # Base UI components (shadcn/ui)

hooks/                # Custom React hooks
lib/                  # Utility libraries and configurations
public/               # Static assets
styles/               # Global styles
```

### Key Concepts

- **App Router**: Using Next.js 13+ App Router for file-based routing
- **Server Components**: Leveraging React Server Components for better performance
- **API Routes**: Next.js API routes for backend functionality
- **Database**: MySQL with connection pooling
- **State Management**: Zustand for client-side state
- **Styling**: Tailwind CSS with shadcn/ui components

## 🎯 Development Workflow

### Branch Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/feature-name` - Feature branches
- `bugfix/bug-description` - Bug fix branches
- `hotfix/issue-description` - Hotfix branches

### Commit Convention
Follow conventional commits:
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(invoices): add invoice upload functionality
fix(dashboard): resolve chart rendering issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following project conventions
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Changes**
   ```bash
   npm run lint
   npm run build
   npm run test (if tests exist)
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use the PR template
   - Include screenshots for UI changes
   - Request review from team members

## 🛠 Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run dev:debug        # Start dev server with debugging

# Building
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript type checking

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database
```

## 🎨 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` types
- Use strict mode configurations

```typescript
// Good
interface User {
  id: number;
  name: string;
  email: string;
}

// Bad
const user: any = { ... };
```

### React Components
- Use functional components with hooks
- Follow React best practices
- Use proper prop types

```tsx
// Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Styling
- Use Tailwind CSS for styling
- Follow component-based architecture
- Use CSS variables for theming

```tsx
// Good
<div className="flex items-center space-x-2 p-4 bg-card rounded-lg">
  <Icon className="h-5 w-5 text-muted-foreground" />
  <span className="text-sm font-medium">Content</span>
</div>
```

### File Naming
- Use kebab-case for file names: `user-profile.tsx`
- Use PascalCase for component names: `UserProfile`
- Use camelCase for functions and variables: `getUserData`

## 🧪 Testing Strategy

### Unit Tests
- Test individual components and functions
- Use Jest and React Testing Library
- Aim for 80%+ code coverage

### Integration Tests
- Test API endpoints
- Test component interactions
- Test database operations

### E2E Tests
- Test critical user journeys
- Use Playwright or Cypress
- Run in CI/CD pipeline

## 🐛 Debugging

### Client-Side Debugging
- Use React DevTools
- Use browser developer tools
- Add console.log statements for development

### Server-Side Debugging
- Use Next.js built-in debugging
- Check server logs
- Use database query logging

### Common Issues

1. **Hydration Errors**
   - Ensure server and client render the same content
   - Use `suppressHydrationWarning` sparingly

2. **Database Connection Issues**
   - Check connection pool configuration
   - Verify environment variables
   - Monitor connection count

## 📦 Package Management

### Adding Dependencies
```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name

# With legacy peer deps (if needed)
npm install --legacy-peer-deps package-name
```

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

## 🚀 Deployment

### Environment Variables
Required environment variables:
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### Build Process
```bash
npm run build
npm run start
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build passes without errors
- [ ] All tests passing
- [ ] Performance optimization applied

## 🤝 Contributing Guidelines

### Code Review
- All changes require code review
- Address all review comments
- Ensure CI checks pass
- Update documentation as needed

### Documentation
- Document new features and APIs
- Update README for major changes
- Include JSDoc comments for functions
- Write clear commit messages

## 📞 Getting Help

- Check existing documentation
- Search closed issues on GitHub
- Ask questions in team chat
- Create detailed bug reports

## 🔗 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)