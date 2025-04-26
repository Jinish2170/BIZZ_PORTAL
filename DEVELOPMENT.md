# BizzPortal Development Guide

## Development Environment Setup

### Required Tools
- VS Code
- Node.js v18+
- pnpm v8+
- MySQL Server
- Git

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- MySQL (optional)

## Coding Standards

### TypeScript Guidelines
- Use strict type checking (`strict: true` in tsconfig)
- Prefer interfaces over types for objects
- Use enums for fixed sets of values
- Always define return types for functions
- Use proper TypeScript utility types
- Avoid using `any`

### React Best Practices
- Use functional components
- Implement proper prop types
- Use proper hooks (useState, useEffect, useCallback, useMemo)
- Keep components small and focused
- Use proper error boundaries
- Implement loading states
- Use proper state management

### CSS/Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use CSS variables for theming
- Follow BEM naming convention for custom CSS
- Use proper CSS modules when needed

### File Structure
```
/components
  /[feature]
    - component.tsx
    - types.ts
    - utils.ts
    - hooks.ts
    - styles.css (if needed)
/lib
  /[feature]
    - types.ts
    - api.ts
    - utils.ts
/app
  /[route]
    - page.tsx
    - layout.tsx
    - loading.tsx
    - error.tsx
```

## State Management

### Zustand Store Guidelines
- Keep stores small and focused
- Use proper types
- Implement proper selectors
- Use proper actions
- Follow immutability patterns
- Implement proper error handling

Example:
```typescript
interface StoreState {
  data: Data[];
  isLoading: boolean;
  error: Error | null;
  fetch: () => Promise<void>;
  add: (item: Data) => void;
  update: (id: string, data: Partial<Data>) => void;
  remove: (id: string) => void;
}
```

## Database Operations

### Query Guidelines
- Use proper indexes
- Implement proper joins
- Use proper transactions
- Implement proper error handling
- Use proper connection pooling
- Implement proper caching
- Use proper prepared statements

Example:
```typescript
async function getDataWithRelations(id: string) {
  return await db.transaction(async (trx) => {
    const data = await trx.query(
      `SELECT * FROM table 
       LEFT JOIN related_table ON table.id = related_table.table_id 
       WHERE table.id = ?`,
      [id]
    );
    return data;
  });
}
```

## API Development

### Route Handler Guidelines
- Implement proper validation
- Use proper HTTP methods
- Implement proper error handling
- Use proper status codes
- Implement proper authentication
- Use proper rate limiting
- Implement proper logging

Example:
```typescript
export async function GET(req: Request) {
  try {
    // Validate request
    const { searchParams } = new URL(req.url);
    const validatedParams = searchParamsSchema.parse(Object.fromEntries(searchParams));

    // Get data
    const data = await getData(validatedParams);

    // Return response
    return Response.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Testing

### Unit Testing Guidelines
- Test components in isolation
- Use proper mocks
- Test edge cases
- Implement proper assertions
- Use proper test descriptions
- Follow AAA pattern (Arrange, Act, Assert)
- Use proper test coverage

Example:
```typescript
describe('Component', () => {
  it('should render properly', () => {
    // Arrange
    const props = {...};

    // Act
    render(<Component {...props} />);

    // Assert
    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
```

## Error Handling

### Frontend Error Handling
- Use proper error boundaries
- Implement proper fallback UI
- Show user-friendly error messages
- Handle network errors
- Handle validation errors
- Implement proper logging

### Backend Error Handling
- Use proper try-catch blocks
- Implement proper error classes
- Return proper error responses
- Handle database errors
- Handle validation errors
- Implement proper logging

Example:
```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  console.error(error);
  return Response.json(
    {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error',
      },
    },
    { status: 500 }
  );
}
```

## Performance Optimization

### Frontend Optimization
- Implement code splitting
- Use proper lazy loading
- Optimize images
- Use proper caching
- Minimize bundle size
- Use proper performance monitoring

### Backend Optimization
- Use proper indexes
- Implement proper caching
- Optimize queries
- Use proper connection pooling
- Implement proper rate limiting
- Use proper performance monitoring

## Security

### Frontend Security
- Implement proper input validation
- Use proper XSS protection
- Implement proper CSRF protection
- Use proper authentication
- Use proper authorization
- Implement proper logging

### Backend Security
- Use proper input validation
- Implement proper SQL injection protection
- Use proper authentication
- Implement proper authorization
- Use proper rate limiting
- Implement proper logging

## Deployment

### Deployment Checklist
- Run tests
- Build production bundle
- Check environment variables
- Update database schemas
- Check dependencies
- Run security checks
- Update documentation

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Secure123!
DB_NAME=bizz_portal

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# API
API_URL=http://localhost:3000
API_RATE_LIMIT=100

# Storage
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=5242880
```

## Git Guidelines

### Branch Naming
- feature/feature-name
- bugfix/bug-name
- hotfix/issue-name
- release/version

### Commit Messages
- feat: Add new feature
- fix: Fix bug
- docs: Update documentation
- style: Update styles
- refactor: Refactor code
- test: Add tests
- chore: Update build tasks

### Pull Request Guidelines
- Proper description
- Link to issue
- Test coverage
- Code review
- Documentation
- Clean commits