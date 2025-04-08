# Stock & HR Management System Documentation

## Project Overview
This is a comprehensive Stock and HR Management System built with React, TypeScript, and modern web technologies. The application features a modular architecture with distinct sections for Stock Management, HR, and Accounting functionalities.

## Current State

### Architecture
- **Frontend Framework**: React with TypeScript
- **Routing**: React Router v6 (with v7 future flags enabled)
- **State Management**: Context API for auth, React hooks for local state
- **UI Components**: Custom components built with shadcn/ui
- **Internationalization**: Built-in support for multiple languages (currently English and French)
- **API Integration**: Axios for HTTP requests

### Implemented Modules

#### 1. Stock Management
- **StockList Component** (`/stock`)
  - Full CRUD operations for stock items
  - Filtering and sorting capabilities
  - Mock data integration for categories and suppliers
  - Responsive table with expandable rows
  - Status indicators for stock levels
  - Form validation

- **Categories Component** (`/stock/categories`)
- **Suppliers Component** (`/stock/suppliers`)
- **Movements Component** (`/stock/movements`)
- **Inventory Component** (`/stock/inventory`)

#### 2. HR Module
- **User Management**
  - UserList Component (`/users`)
  - UserForm Component for creation/editing
- **Employee Management**
- **Department Management**
- **Position Management**

#### 3. Accounting Module
- **Invoices**
- **Proforma Invoices**
- **Contracts**
- **Journal Entries**
- **Chart of Accounts**
- **Financial Statements**

### Current Features
1. **Authentication**
   - Protected routes
   - Role-based access control
   - Session management

2. **UI/UX**
   - Dark/Light theme support
   - Responsive design
   - Loading states
   - Toast notifications
   - Form validations
   - Error handling

3. **Data Management**
   - Filtering
   - Sorting
   - Pagination
   - Search functionality

## Pending Tasks

### 1. Backend Integration
- Implement `/stock/categories` endpoint
- Implement `/stock/suppliers` endpoint
- Currently using mock data for these endpoints

### 2. Feature Enhancements

#### Stock Module
1. **Categories Management**
   - Implement full CRUD operations
   - Add category hierarchies
   - Add category-specific attributes

2. **Suppliers Management**
   - Complete supplier profile management
   - Add supplier rating system
   - Implement supplier communication log

3. **Inventory Management**
   - Add batch tracking
   - Implement expiry date management
   - Add barcode/QR code support

#### HR Module
1. **Employee Management**
   - Complete attendance tracking
   - Add leave management
   - Implement performance reviews

2. **Payroll System**
   - Salary calculation
   - Tax deductions
   - Benefits management

#### Accounting Module
1. **Financial Reports**
   - Generate PDF reports
   - Add customizable templates
   - Implement export functionality

### 3. Technical Improvements
1. **Performance Optimization**
   - Implement data caching
   - Add request debouncing
   - Optimize bundle size

2. **Testing**
   - Add unit tests
   - Implement integration tests
   - Add end-to-end tests

3. **Documentation**
   - Add JSDoc comments
   - Create API documentation
   - Add component storybook

## Known Issues
1. React Router warnings about future v7 changes
2. 404 errors for missing backend endpoints
3. Missing translations for some new features

## Next Steps

### Immediate Priority
1. Implement backend endpoints for:
   - Categories
   - Suppliers
   - Stock movements
   - Inventory tracking

2. Add missing translations for:
   - Dialog descriptions
   - Error messages
   - New feature labels

3. Complete the remaining CRUD operations for:
   - Categories management
   - Suppliers management
   - Stock movements

### Medium-term Goals
1. Implement advanced filtering and reporting
2. Add data export functionality
3. Implement batch operations
4. Add real-time notifications

### Long-term Goals
1. Add analytics dashboard
2. Implement predictive inventory management
3. Add mobile application support
4. Implement multi-tenant architecture

## Development Guidelines

### Code Structure
- Keep components modular and reusable
- Follow the established pattern for API calls
- Maintain consistent error handling
- Use TypeScript interfaces for type safety

### State Management
- Use React Context for global state
- Keep component state local when possible
- Implement proper loading and error states

### UI/UX Guidelines
- Follow the established design system
- Maintain responsive design
- Implement proper form validation
- Add loading states for async operations

### Testing
- Write unit tests for new components
- Add integration tests for critical paths
- Maintain test coverage above 80%

## Deployment
- Current deployment: Development environment
- Build process: Vite
- Environment variables needed:
  - API endpoints
  - Authentication keys
  - Feature flags

## Security Considerations
- Implement proper input validation
- Add rate limiting
- Secure API endpoints
- Implement proper CORS policies

## Technical Specifications

### Core Dependencies
```json
{
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "@reduxjs/toolkit": "^2.0.1",
    "axios": "^1.6.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "i18next": "^23.7.11",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.2",
    "react-i18next": "^13.5.0",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.21.0",
    "tailwind-merge": "^2.1.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

### Technical Approach

#### 1. UI Component Architecture
- Using **shadcn/ui** as the base component library
- All components are built on top of **Radix UI** primitives
- Custom theme implementation using **Tailwind CSS**
- Component structure follows Atomic Design principles:
  ```
  src/
    components/
      ui/          # Base UI components
      common/      # Shared components
      modules/     # Module-specific components
  ```

#### 2. State Management Strategy
- **Redux Toolkit** for global state management
  - Auth state
  - User preferences
  - Application settings
- **React Context** for theme and localization
- **Local State** using React hooks for component-specific state
- **Redux Slices Structure**:
  ```
  src/
    features/
      auth/
        authSlice.ts
        authThunks.ts
      settings/
        settingsSlice.ts
      stock/
        stockSlice.ts
        stockThunks.ts
  ```

#### 3. Form Handling
- Using **React Hook Form** for form management
- **Zod** for form validation schemas
- Form structure example:
  ```typescript
  const schema = z.object({
    name: z.string().min(2).max(50),
    quantity: z.number().min(0),
    category: z.string().uuid(),
    supplier: z.string().uuid()
  });

  type FormData = z.infer<typeof schema>;
  ```

#### 4. API Integration
- **Axios** for HTTP requests
- Custom axios instance with interceptors
- API structure:
  ```typescript
  // api.ts
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use(addAuthHeader);
  api.interceptors.response.use(handleSuccess, handleError);
  ```

#### 5. Internationalization
- Using **i18next** with **react-i18next**
- Translation structure:
  ```
  src/
    i18n/
      locales/
        en.json
        fr.json
      index.ts
  ```

#### 6. Routing and Navigation
- **React Router v6** with future flags enabled
- Protected routes implementation
- Role-based access control
- Route structure:
  ```typescript
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/stock/*" element={<ProtectedRoute><StockRoutes /></ProtectedRoute>} />
      <Route path="/hr/*" element={<ProtectedRoute><HRRoutes /></ProtectedRoute>} />
      <Route path="/accounting/*" element={<ProtectedRoute><AccountingRoutes /></ProtectedRoute>} />
    </Route>
  </Routes>
  ```

#### 7. Styling Approach
- **Tailwind CSS** for styling
- Custom theme configuration
- Consistent color palette and spacing
- Responsive design utilities
- Dark/Light theme support

#### 8. Error Handling
- Global error boundary
- Axios error interceptors
- Toast notifications for user feedback
- Error logging and monitoring

### Development Workflow

#### 1. Component Development
1. Create component file in appropriate directory
2. Define TypeScript interfaces
3. Implement component using shadcn/ui base components
4. Add translations
5. Implement error handling
6. Add loading states

#### 2. Feature Implementation
1. Create Redux slice if needed
2. Implement API integration
3. Create component(s)
4. Add routing
5. Implement error handling
6. Add translations
7. Test functionality

#### 3. Code Style Guidelines
- Use TypeScript strict mode
- Follow ESLint configuration
- Use prettier for code formatting
- Follow component naming conventions:
  - Components: PascalCase
  - Files: PascalCase.tsx
  - Utilities: camelCase.ts

### Important Notes for Future Development

1. **DO NOT**:
   - Change the UI component library from shadcn/ui
   - Modify the base theme implementation
   - Change the state management approach
   - Modify the existing folder structure
   - Change the internationalization setup

2. **DO**:
   - Follow the existing patterns for new features
   - Add proper TypeScript types
   - Maintain the current code organization
   - Use the established component library
   - Follow the error handling patterns
   - Add translations for new features

This documentation should be updated as new features are added or existing ones are modified.

### Project Structure
```
src/
├── components/
│   ├── ui/                    # Base UI components from shadcn/ui
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── common/               # Shared components
│   │   ├── DataTable/
│   │   ├── ErrorBoundary/
│   │   ├── LoadingSpinner/
│   │   └── ...
│   └── modules/              # Module-specific components
├── contexts/                 # React Context definitions
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── features/                 # Redux slices and state management
│   ├── auth/
│   ├── settings/
│   └── stock/
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts
│   ├── useToast.ts
│   └── useTranslation.ts
├── i18n/                     # Internationalization
│   ├── locales/
│   └── index.ts
├── lib/                      # Utility functions and constants
│   ├── utils.ts
│   └── constants.ts
├── modules/                  # Feature modules
│   ├── accounting/
│   ├── hr/
│   └── stock/
├── services/                 # API services
│   ├── api.ts
│   └── endpoints.ts
├── styles/                   # Global styles
│   └── globals.css
├── types/                    # TypeScript type definitions
│   └── index.d.ts
└── App.tsx
```

### Detailed Component Examples

#### 1. Base Component Structure
```typescript
// Example of a typical component structure
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/useToast';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface ComponentProps {
  // Props definition
}

const validationSchema = z.object({
  // Validation rules
});

export function Component({ ...props }: ComponentProps) {
  // Hook declarations
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Form handling
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {}
  });

  // Event handlers
  const handleSubmit = async (data: FormData) => {
    try {
      // API call
    } catch (error) {
      // Error handling
    }
  };

  return (
    // JSX
  );
}
```

#### 2. Form Implementation Pattern
```typescript
// Example of a form implementation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user', 'manager']),
  status: z.boolean(),
  permissions: z.array(z.string()).min(1, 'Select at least one permission')
});

type FormData = z.infer<typeof formSchema>;

export function UserForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: true,
      permissions: []
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      // API call
    } catch (error) {
      // Error handling
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### API Integration Patterns

#### 1. API Service Structure
```typescript
// api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

class ApiService {
  private api: AxiosInstance;
  
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    this.api.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  private handleRequest = (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  // ... other handler methods
}

export const apiService = new ApiService();
```

#### 2. Redux Integration
```typescript
// stockSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/api';

export const fetchStockItems = createAsyncThunk(
  'stock/fetchItems',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/stock', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    // Synchronous reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchStockItems.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});
```

### Authentication Implementation

```typescript
// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const user = await apiService.get('/auth/me');
        setUser(user.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // ... login, logout methods
}
```

### Internationalization Setup

```typescript
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import fr from './locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### Theme Implementation

```typescript
// theme-provider.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const ThemeProviderContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
```

### Error Handling Pattern

```typescript
// ErrorBoundary.tsx
import React, { Component, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

# Stock & HR Management System - Complete Technical Specification

## Complete Technical Architecture

### Frontend Architecture

#### Core Technologies
- **Framework**: React 18.2.0 with TypeScript 5.3.3
- **Build Tool**: Vite 5.0.8
- **Package Manager**: npm
- **State Management**: Redux Toolkit + React Context
- **Routing**: React Router v6.21.0
- **Form Management**: React Hook Form + Zod
- **UI Framework**: shadcn/ui (based on Radix UI)
- **Styling**: Tailwind CSS 3.3.6
- **HTTP Client**: Axios 1.6.2
- **Internationalization**: i18next 23.7.11
- **Icons**: Lucide React 0.294.0

#### Animation Libraries
- **Framer Motion**: For component animations
- **AutoAnimate**: For list animations
- **react-spring**: For physics-based animations
- **Tailwind CSS Animate**: For utility-based animations

#### Frontend Project Structure
```
frontend/
├── public/
│   ├── fonts/
│   ├── images/
│   └── locales/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── common/            # Shared components
│   │   │   ├── Layout/
│   │   │   ├── Navigation/
│   │   │   └── ...
│   │   └── modules/           # Module-specific components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   └── ...
│   ├── features/             # Redux slices
│   │   ├── auth/
│   │   ├── stock/
│   │   └── ...
│   ├── services/            # API services
│   │   ├── api.ts
│   │   └── endpoints.ts
│   ├── utils/              # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── types/             # TypeScript types
│   │   └── index.d.ts
│   └── App.tsx
├── .env.development
├── .env.production
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### Backend Architecture

#### Core Technologies
- **Framework**: Express.js 4.18.2
- **Runtime**: Node.js 18.x
- **Database**: MongoDB 6.0
- **ODM**: Mongoose 8.0.3
- **Authentication**: JWT + bcrypt
- **API Documentation**: Swagger UI Express
- **File Upload**: Multer
- **Email Service**: Nodemailer
- **Validation**: Express Validator
- **Logging**: Winston + Morgan

#### Backend Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── mail.ts
│   │   └── swagger.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── stock.controller.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── ...
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── stock.model.ts
│   │   └── ...
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── stock.routes.ts
│   │   └── ...
│   ├── services/
│   │   ├── mail.service.ts
│   │   ├── pdf.service.ts
│   │   └── ...
│   ├── utils/
│   │   ├── logger.ts
│   │   └── helpers.ts
│   └── app.ts
├── .env
├── package.json
└── tsconfig.json
```

### Database Schema

#### MongoDB Collections

1. **Users Collection**
```typescript
interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

2. **Stock Collection**
```typescript
interface StockItem {
  _id: ObjectId;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: ObjectId;
  supplier: ObjectId;
  reorderPoint: number;
  location: string;
  lastRestocked: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

3. **Categories Collection**
```typescript
interface Category {
  _id: ObjectId;
  name: string;
  description: string;
  parent: ObjectId | null;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

[Additional collection schemas...]

### API Integration

#### Base API Configuration
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

### Build and Deployment

#### Development Environment
```bash
# Frontend
npm run dev        # Starts Vite dev server
npm run build      # Builds for production
npm run preview    # Preview production build

# Backend
npm run dev        # Starts nodemon
npm run build      # Compiles TypeScript
npm run start      # Starts production server
```

#### Production Deployment
- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to DigitalOcean
- **Database**: MongoDB Atlas
- **CI/CD**: GitHub Actions

#### Environment Variables
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_STORAGE_PREFIX=stock_hr_
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Backend (.env)
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stock_hr
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Animation and Transition Specifications

#### Page Transitions
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};
```

#### Component Animations
```typescript
// List item animations
const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

// Modal animations
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};
```

### Known Limitations and TODOs

#### Current Limitations
1. **Performance**
   - Large lists not virtualized
   - Image optimization needed
   - Initial bundle size optimization required

2. **Browser Support**
   - Minimum supported browsers:
     - Chrome 80+
     - Firefox 75+
     - Safari 13.1+
     - Edge 80+

3. **Feature Limitations**
   - No offline support
   - Limited mobile responsiveness
   - No real-time updates

#### High-Priority TODOs
1. **Frontend**
   - Implement virtual scrolling for large lists
   - Add PWA support
   - Optimize bundle size
   - Add end-to-end tests

2. **Backend**
   - Implement rate limiting
   - Add caching layer
   - Improve error handling
   - Add API documentation

3. **DevOps**
   - Set up monitoring
   - Implement automated backups
   - Add performance metrics
   - Improve CI/CD pipeline

### Security Measures

1. **Frontend Security**
   - CSRF protection
   - XSS prevention
   - Content Security Policy
   - Secure localStorage handling

2. **Backend Security**
   - Rate limiting
   - JWT token validation
   - Input sanitization
   - CORS configuration

3. **API Security**
   - Request validation
   - Response sanitization
   - Error handling
   - Authentication middleware

### Role-Based Access Control (RBAC)

#### User Roles and Permissions
```typescript
type UserRole = 'admin' | 'hr' | 'accountant' | 'manager' | 'user';

interface RolePermissions {
  role: UserRole;
  permissions: {
    create: string[];
    read: string[];
    update: string[];
    delete: string[];
  };
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    role: 'admin',
    permissions: {
      create: ['*'],
      read: ['*'],
      update: ['*'],
      delete: ['*']
    }
  },
  hr: {
    role: 'hr',
    permissions: {
      create: ['employees', 'departments', 'positions', 'attendance', 'leaves', 'payroll'],
      read: ['employees', 'departments', 'positions', 'attendance', 'leaves', 'payroll'],
      update: ['employees', 'departments', 'positions', 'attendance', 'leaves', 'payroll'],
      delete: ['employees', 'departments', 'positions', 'attendance', 'leaves']
    }
  },
  accountant: {
    role: 'accountant',
    permissions: {
      create: ['invoices', 'expenses', 'payments', 'journal-entries', 'financial-reports'],
      read: ['invoices', 'expenses', 'payments', 'journal-entries', 'financial-reports', 'payroll'],
      update: ['invoices', 'expenses', 'payments', 'journal-entries'],
      delete: ['invoices', 'expenses', 'payments', 'journal-entries']
    }
  },
  manager: {
    role: 'manager',
    permissions: {
      create: ['stock', 'purchase-orders', 'suppliers'],
      read: ['stock', 'purchase-orders', 'suppliers', 'employees', 'departments', 'financial-reports'],
      update: ['stock', 'purchase-orders', 'suppliers'],
      delete: ['stock', 'purchase-orders']
    }
  },
  user: {
    role: 'user',
    permissions: {
      create: [],
      read: ['stock', 'departments'],
      update: [],
      delete: []
    }
  }
};
```

### HR Module Specifications

#### Database Schemas

1. **Employee Collection**
```typescript
interface Employee {
  _id: ObjectId;
  userId: ObjectId;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    maritalStatus: string;
    nationality: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  employmentDetails: {
    employeeId: string;
    department: ObjectId;
    position: ObjectId;
    joinDate: Date;
    employmentType: 'full-time' | 'part-time' | 'contract';
    status: 'active' | 'inactive' | 'on-leave';
  };
  payroll: {
    salary: number;
    bankAccount: string;
    taxId: string;
  };
  documents: Array<{
    type: string;
    name: string;
    url: string;
    uploadDate: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

2. **Department Collection**
```typescript
interface Department {
  _id: ObjectId;
  name: string;
  description: string;
  manager: ObjectId;
  parentDepartment: ObjectId | null;
  budget: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

3. **Position Collection**
```typescript
interface Position {
  _id: ObjectId;
  title: string;
  department: ObjectId;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

4. **Attendance Collection**
```typescript
interface Attendance {
  _id: ObjectId;
  employee: ObjectId;
  date: Date;
  checkIn: Date;
  checkOut: Date;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Accounting Module Specifications

#### Database Schemas

1. **Invoice Collection**
```typescript
interface Invoice {
  _id: ObjectId;
  invoiceNumber: string;
  type: 'sales' | 'purchase';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  client: {
    name: string;
    email: string;
    address: string;
    taxId?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  dueDate: Date;
  notes: string;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

2. **Journal Entry Collection**
```typescript
interface JournalEntry {
  _id: ObjectId;
  entryNumber: string;
  date: Date;
  description: string;
  entries: Array<{
    account: ObjectId;
    debit: number;
    credit: number;
    description: string;
  }>;
  status: 'draft' | 'posted' | 'adjusted';
  attachments: Array<{
    name: string;
    url: string;
    uploadDate: Date;
  }>;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

3. **Chart of Accounts Collection**
```typescript
interface Account {
  _id: ObjectId;
  accountNumber: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subtype: string;
  description: string;
  balance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Module-Specific Features

#### HR Module Features
1. **Employee Management**
   - Employee profile creation and management
   - Document management
   - Leave management
   - Attendance tracking
   - Performance reviews

2. **Payroll Management**
   - Salary calculation
   - Tax deductions
   - Benefits management
   - Payslip generation
   - Bank transfer integration

3. **Department Management**
   - Department hierarchy
   - Budget allocation
   - Staff assignment
   - Performance metrics

4. **Reporting**
   - Attendance reports
   - Leave balance reports
   - Payroll reports
   - Department performance reports

#### Accounting Module Features
1. **Financial Management**
   - Invoice generation
   - Payment tracking
   - Expense management
   - Bank reconciliation
   - Tax management

2. **Journal Entries**
   - Double-entry bookkeeping
   - Recurring entries
   - Entry validation
   - Audit trail

3. **Financial Reporting**
   - Balance sheet
   - Income statement
   - Cash flow statement
   - Tax reports
   - Custom financial reports

4. **Budget Management**
   - Budget creation
   - Expense tracking
   - Variance analysis
   - Forecasting

### Recent System Updates

#### Theme System Enhancements
1. **Default Theme**
   - Light theme set as default
   - Removed `forceDark` property
   - Improved theme persistence
   - Enhanced theme switching performance

2. **RTL Support**
   - Full RTL layout support
   - Bidirectional text handling
   - RTL-aware component positioning
   - RTL-specific animations and transitions

3. **Mobile Responsiveness**
   - Improved mobile navigation
   - Better touch interactions
   - Responsive layout adjustments
   - Mobile-first design approach

#### Navigation System Updates
1. **Menu Structure**
   - Reorganized navigation hierarchy
   - Improved path handling
   - Enhanced mobile drawer
   - Better nested menu support

2. **Path Management**
   - Updated HR path to `/hr/dashboard`
   - Updated Accounting path to `/accounting/dashboard`
   - Improved route protection
   - Enhanced breadcrumb generation

3. **User Experience**
   - Smoother transitions
   - Better loading states
   - Improved error handling
   - Enhanced accessibility

### Accessibility Improvements

#### 1. ARIA Support
```typescript
interface AccessibilityProps {
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}

// Component implementation
const AccessibleComponent = ({
  role = 'region',
  'aria-label': ariaLabel,
  children,
  ...props
}: AccessibilityProps & { children: React.ReactNode }) => {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </div>
  );
};
```

#### 2. Keyboard Navigation
```typescript
const useKeyboardNav = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Tab':
          // Handle tab navigation
          break;
        case 'Escape':
          // Handle escape key
          break;
        // Other key handlers
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

### Performance Optimizations

#### 1. Code Splitting
```typescript
// Lazy loading components
const LazyComponent = React.lazy(() => import('./Component'));

// Route-based code splitting
const routes = [
  {
    path: '/dashboard',
    component: React.lazy(() => import('./pages/Dashboard'))
  },
  {
    path: '/stock',
    component: React.lazy(() => import('./pages/Stock'))
  }
];
```

#### 2. Memoization
```typescript
// Component memoization
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});

// Hook memoization
const useMemoizedValue = (value: any) => {
  return useMemo(() => {
    return expensiveComputation(value);
  }, [value]);
};
```

### Error Handling Enhancements

#### 1. Global Error Boundary
```typescript
class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### 2. API Error Handling
```typescript
const apiErrorHandler = (error: AxiosError) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // Handle unauthorized
        break;
      case 403:
        // Handle forbidden
        break;
      case 404:
        // Handle not found
        break;
      default:
        // Handle other errors
    }
  }
  return Promise.reject(error);
};
```

### Testing Strategy Updates

#### 1. Unit Testing
```typescript
describe('Component Tests', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Title')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const { getByRole } = render(<Component />);
    const button = getByRole('button');
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### 2. Integration Testing
```typescript
describe('Feature Integration', () => {
  it('should complete the workflow', async () => {
    const { getByText, findByRole } = render(<FeatureComponent />);
    
    // Trigger action
    await userEvent.click(getByText('Start'));
    
    // Wait for result
    const result = await findByRole('status');
    expect(result).toHaveTextContent('Complete');
  });
});
```

### Security Enhancements

#### 1. Input Validation
```typescript
const validateInput = (input: unknown): boolean => {
  if (typeof input !== 'string') return false;
  return /^[a-zA-Z0-9\s-_]+$/.test(input);
};

const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};
```

#### 2. Authentication Flow
```typescript
const authFlow = {
  login: async (credentials: Credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token securely
      secureStorage.setItem('token', token);
      
      // Update auth state
      dispatch(setUser(user));
      
      return user;
    } catch (error) {
      handleAuthError(error);
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
      secureStorage.removeItem('token');
      dispatch(clearUser());
    } catch (error) {
      handleAuthError(error);
    }
  }
};
```

### Monitoring and Logging

#### 1. Performance Monitoring
```typescript
const performanceMonitor = {
  trackRender: (componentName: string) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      console.log(`${componentName} rendered in ${duration}ms`);
    };
  },
  
  trackOperation: async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      console.log(`${operationName} completed in ${duration}ms`);
      return result;
    } catch (error) {
      console.error(`${operationName} failed after ${performance.now() - start}ms`);
      throw error;
    }
  }
};
```

#### 2. Error Logging
```typescript
const errorLogger = {
  log: (error: Error, context?: Record<string, unknown>) => {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  },
  
  track: (error: Error, severity: 'low' | 'medium' | 'high') => {
    // Send to monitoring service
    monitoringService.trackError({
      error,
      severity,
      environment: process.env.NODE_ENV,
      version: process.env.APP_VERSION
    });
  }
};
```

### Future Development Roadmap

#### 1. Technical Improvements
- Implement service workers for offline support
- Add WebSocket support for real-time updates
- Implement progressive image loading
- Add support for WebAssembly modules
- Implement micro-frontends architecture

#### 2. Feature Enhancements
- Advanced data visualization
- AI-powered insights
- Automated reporting
- Enhanced mobile experience
- Advanced search capabilities

#### 3. Infrastructure Updates
- Implement edge caching
- Add serverless functions support
- Implement GraphQL API
- Add containerization support
- Implement CI/CD pipelines

This documentation should be updated as new features are added or existing ones are modified. 

## System Architecture

### Database Architecture
- **Database**: MongoDB (v4.4 or higher)
- **Database Name**: `stock-hr`
- **Connection URI**: `mongodb://localhost:27017/stock_hr` (development)
- **ODM**: Mongoose
- **Collections**:
  - Users
  - Stock Items
  - Categories
  - Suppliers
  - Employees
  - Departments
  - Positions
  - Invoices
  - Journal Entries
  - Chart of Accounts

### Tech Stack

#### Frontend
- **Framework**: React 18.2.0 with TypeScript 5.3.3
- **Build Tool**: Vite 5.0.8
- **State Management**: Redux Toolkit + React Context
- **Routing**: React Router v6.21.0
- **Form Management**: React Hook Form + Zod
- **UI Framework**: shadcn/ui (based on Radix UI)
- **Styling**: Tailwind CSS 3.3.6
- **HTTP Client**: Axios 1.6.2
- **Internationalization**: i18next 23.7.11
- **Icons**: Lucide React 0.294.0

#### Backend
- **Framework**: Express.js 4.18.2
- **Runtime**: Node.js 18.x
- **Database**: MongoDB 6.0
- **ODM**: Mongoose 8.0.3
- **Authentication**: JWT + bcrypt
- **API Documentation**: Swagger UI Express
- **File Upload**: Multer
- **Email Service**: Nodemailer
- **Validation**: Express Validator
- **Logging**: Winston + Morgan

### Project Structure

#### Frontend
```
frontend/
├── public/
│   ├── fonts/
│   ├── images/
│   └── locales/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── common/            # Shared components
│   │   └── modules/           # Module-specific components
│   ├── hooks/                 # Custom React hooks
│   ├── features/             # Redux slices
│   ├── services/            # API services
│   ├── utils/              # Utility functions
│   ├── types/             # TypeScript types
│   └── App.tsx
```

#### Backend
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.ts
```

### Deployment Architecture

#### Development Environment
```bash
# Frontend
npm run dev        # Starts Vite dev server
npm run build      # Builds for production
npm run preview    # Preview production build

# Backend
npm run dev        # Starts nodemon
npm run build      # Compiles TypeScript
npm run start      # Starts production server
```

#### Production Deployment
- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to DigitalOcean
- **Database**: MongoDB Atlas
- **CI/CD**: GitHub Actions

#### Environment Variables
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_STORAGE_PREFIX=stock_hr_
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Backend (.env)
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stock_hr
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Security Architecture

#### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing with bcrypt
- Session management
- CSRF protection
- Rate limiting

#### Data Security
- Input validation
- Output sanitization
- Data encryption
- Secure file uploads
- Audit logging

#### Network Security
- HTTPS enforcement
- CORS configuration
- API rate limiting
- IP whitelisting
- DDoS protection

### Monitoring & Logging

#### Frontend Monitoring
- Error tracking
- Performance monitoring
- User behavior analytics
- Real-time logging

#### Backend Monitoring
- Request logging
- Error tracking
- Performance metrics
- Database monitoring
- System health checks

### Backup & Recovery

#### Database Backups
- Automated daily backups
- Point-in-time recovery
- Backup verification
- Secure storage

#### System Recovery
- Disaster recovery plan
- Data restoration procedures
- System failover
- Business continuity

This documentation should be updated as new features are added or existing ones are modified. 

### Roles and Permissions

#### 1. Superadmin
- **Responsibilities**:
  - System configuration and maintenance
  - User management and role assignment
  - Security settings and audit logs
  - Database management and backups
  - System-wide settings and configurations
- **Permissions**:
  - Full access to all modules and features
  - Can create and manage all user roles
  - Can modify system settings
  - Can access audit logs and system reports
  - Can perform database operations

#### 2. Admin
- **Responsibilities**:
  - User management
  - Department management
  - System monitoring
  - Report generation
  - Issue resolution
- **Permissions**:
  - Create and manage users (except Superadmin)
  - Manage departments and positions
  - Access all reports and analytics
  - Configure system settings
  - Manage notifications and alerts

#### 3. HR Manager
- **Responsibilities**:
  - Employee management
  - Leave management
  - Performance reviews
  - Payroll processing
  - Department oversight
- **Permissions**:
  - Access HR module
  - Manage employee records
  - Process leave requests
  - Conduct performance reviews
  - Generate HR reports
  - Manage department structures

#### 4. Accountant
- **Responsibilities**:
  - Financial management
  - Invoice processing
  - Journal entries
  - Financial reporting
  - Tax management
- **Permissions**:
  - Access accounting module
  - Create and manage invoices
  - Process journal entries
  - Generate financial reports
  - Manage chart of accounts
  - Access financial analytics

#### 5. Stock Manager
- **Responsibilities**:
  - Inventory management
  - Stock movements
  - Supplier management
  - Category management
  - Stock reporting
- **Permissions**:
  - Access stock module
  - Manage inventory items
  - Process stock movements
  - Manage suppliers and categories
  - Generate stock reports
  - Set reorder points

#### 6. Salesperson
- **Responsibilities**:
  - Customer management
  - Sales processing
  - Order management
  - Customer service
  - Sales reporting
- **Permissions**:
  - Access sales module
  - Create and manage orders
  - Process sales transactions
  - View customer information
  - Generate sales reports
  - Access sales analytics

#### Permission Matrix
| Feature            | Superadmin | Admin | HR Manager | Accountant | Stock Manager | Salesperson |
|-------------------|------------|-------|------------|------------|---------------|-------------|
| User Management   | Full       | Full  | None       | None       | None          | None        |
| HR Management     | Full       | Full  | Full       | None       | None          | None        |
| Accounting        | Full       | Full  | None       | Full       | None          | None        |
| Stock Management  | Full       | Full  | None       | None       | Full          | None        |
| Sales Management  | Full       | Full  | None       | None       | None          | Full        |
| Reports           | Full       | Full  | HR Only    | Finance    | Stock         | Sales       |
| System Settings   | Full       | Full  | None       | None       | None          | None        |

This documentation should be updated as new features are added or existing ones are modified. 