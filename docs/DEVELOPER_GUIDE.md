# Developer Guide: Stock & HR Management System

This document provides technical documentation for developers working on the Stock & HR Management System. It covers architecture, code organization, development workflows, and best practices.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Development Environment Setup](#development-environment-setup)
- [Development Workflow](#development-workflow)
- [Component Development Guidelines](#component-development-guidelines)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication & Authorization](#authentication--authorization)
- [Internationalization](#internationalization)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Contributing](#contributing)

## Architecture Overview

The Stock & HR Management System uses a client-server architecture:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │<────>│ Express Backend │<────>│ MongoDB Database│
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
       ^                        ^
       │                        │
       v                        v
┌─────────────────┐      ┌─────────────────┐
│  Redux State    │      │ External APIs   │
│  Management     │      │ (if applicable) │
└─────────────────┘      └─────────────────┘
```

- **Frontend**: React SPA with TypeScript, Material-UI, and Redux
- **Backend**: Node.js/Express with TypeScript
- **Database**: MongoDB for data persistence
- **API**: RESTful API endpoints for communication
- **State Management**: Redux for global state, React Query for remote data

## Technology Stack

### Frontend
- **Core**: React 18, TypeScript
- **UI Framework**: Material-UI v5
- **State Management**: Redux Toolkit
- **Remote Data**: React Query
- **Routing**: React Router v6
- **Form Handling**: Formik with Yup validation
- **Internationalization**: react-i18next
- **Charts**: Recharts
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend
- **Core**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Logging**: Winston
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest, Supertest

## Project Structure

### Frontend Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── animations/         # Animation definitions
│   ├── components/         # Shared UI components
│   │   ├── common/         # Generic components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   └── charts/         # Chart components
│   ├── features/           # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── dashboard/      # Dashboard
│   │   ├── inventory/      # Inventory management
│   │   ├── contracts/      # Contract management
│   │   ├── invoices/       # Invoice management
│   │   └── users/          # User management
│   ├── hooks/              # Custom React hooks
│   ├── i18n/               # Internationalization
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── store/              # Redux store configuration
│   │   ├── slices/         # Redux slices
│   │   └── index.ts        # Store initialization
│   ├── theme/              # Theme configuration
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
└── package.json            # Dependencies and scripts
```

### Backend Structure

```
backend/
├── src/
│   ├── api/                # API routes
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── services/           # Business logic
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── server.ts           # Server entry point
├── tests/                  # Test files
└── package.json            # Dependencies and scripts
```

## Development Environment Setup

### Prerequisites
- Node.js v14+
- MongoDB v4.4+
- Git
- Code editor (VS Code recommended)

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript Hero
- Material Icon Theme
- MongoDB for VS Code
- REST Client

### Setup Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/stock-hr.git
   cd stock-hr
   ```

2. Install root dependencies
   ```bash
   npm install
   ```

3. Set up frontend
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

4. Set up backend
   ```bash
   cd ../backend
   npm install
   cp .env.example .env
   ```

5. Configure environment variables
   ```
   # Frontend (.env)
   REACT_APP_API_URL=http://localhost:5000/api

   # Backend (.env)
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stockhr
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

6. Run development servers
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm start
   ```

## Development Workflow

### Git Workflow

We follow a simplified Git Flow:

1. Create a feature branch from `develop`
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Make changes, commit with meaningful messages
   ```bash
   git add .
   git commit -m "feat: add user profile page"
   ```

3. Push your branch and create a Pull Request to `develop`
   ```bash
   git push origin feature/your-feature-name
   ```

4. After review, merge to `develop`
5. Periodically, `develop` is merged to `main` for releases

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Changes to build process, dependencies, etc.

Example:
```
feat(auth): add password reset functionality

- Add reset password API endpoint
- Create password reset email template
- Implement reset password UI form

Closes #123
```

## Component Development Guidelines

### Component Structure

For React components, follow this structure:

```tsx
// Imports
import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Types
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// Component
const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // Hooks
  const { t } = useTranslation();
  
  // State
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Effects
  React.useEffect(() => {
    // Effect logic
  }, []);
  
  // Handlers
  const handleClick = () => {
    setIsLoading(true);
    onAction();
    setIsLoading(false);
  };
  
  // Render
  return (
    <Box>
      <Typography variant="h4">{title}</Typography>
      <Button onClick={handleClick} disabled={isLoading}>
        {t('common.action')}
      </Button>
    </Box>
  );
};

export default Component;
```

### Component Best Practices

1. **Single Responsibility**: Components should do one thing well
2. **Prop Types**: Always define prop types with TypeScript interfaces
3. **Memoization**: Use `React.memo` for performance-critical components
4. **Custom Hooks**: Extract complex logic into custom hooks
5. **Naming**:
   - Use PascalCase for component names
   - Use camelCase for instances and variables
   - Prefix boolean props with `is`, `has`, or `should`

## State Management

### Redux Organization

We use Redux Toolkit for global state management, organized into slices:

```typescript
// src/features/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// State interface
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    // API call logic
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous reducers
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // Async reducer handlers
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

### Local Component State

For component-level state, use React's `useState` and `useReducer` hooks:

```typescript
// Simple state
const [isOpen, setIsOpen] = useState(false);

// Complex state
const [state, dispatch] = useReducer(reducer, initialState);
```

### When to Use Each Type of State

- **Redux**: For global state shared across multiple components
  - User authentication
  - App-wide settings
  - Shared data resources

- **React Query**: For server state and API data
  - Data fetching
  - Caching
  - Background updates

- **Component State**: For UI state specific to a component
  - Form inputs
  - Toggle states
  - UI loading states

## API Integration

### API Service Structure

```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
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

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors (401, 403, etc.)
    return Promise.reject(error);
  }
);

export default api;
```

### Service Classes

```typescript
// src/services/UserService.ts
import api from './api';
import { User, UserCreate } from '../types';

class UserService {
  private static instance: UserService;
  private endpoint = '/users';

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getAll(): Promise<User[]> {
    const response = await api.get(this.endpoint);
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(user: UserCreate): Promise<User> {
    const response = await api.post(this.endpoint, user);
    return response.data;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const response = await api.put(`${this.endpoint}/${id}`, user);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

export default UserService;
```

## Authentication & Authorization

### Authentication Flow

1. User submits login credentials
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Subsequent API requests include token in Authorization header
5. Protected routes check for valid token

### Protected Routes

```tsx
// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PrivateRouteProps extends RouteProps {
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  roles = [],
  ...rest
}) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  
  const userHasRequiredRole = roles.length === 0 || 
    (user && roles.includes(user.role));
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (!userHasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Route {...rest} />;
};

export default PrivateRoute;
```

## Internationalization

### i18n Setup

We use react-i18next for internationalization:

```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';
import arTranslation from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      ar: { translation: arTranslation },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### Translation Usage

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Handle RTL for Arabic
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
      
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
    </div>
  );
};
```

### Translation Files

```json
// src/i18n/locales/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading..."
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "email": "Email Address",
    "password": "Password"
  }
}
```

## Testing

### Unit Testing Components

We use Jest and React Testing Library for component testing:

```tsx
// src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  test('renders correctly', () => {
    render(<Button>Test</Button>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Test</Button>);
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByText('Test')).toBeDisabled();
  });
});
```

### API Testing

```typescript
// backend/tests/api/users.test.ts
import request from 'supertest';
import { app } from '../../src/server';
import { connectDB, dropDB, dropCollections } from '../util/db-handler';
import User from '../../src/models/User';

describe('User API', () => {
  beforeAll(async () => {
    await connectDB();
  });
  
  afterEach(async () => {
    await dropCollections();
  });
  
  afterAll(async () => {
    await dropDB();
  });
  
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
    };
    
    const res = await request(app)
      .post('/api/users')
      .send(userData);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.email).toBe(userData.email);
    expect(res.body).not.toHaveProperty('password');
  });
  
  // More tests...
});
```

## Deployment

### Environment Configuration

Create environment-specific `.env` files:

```
.env.development   # Development environment
.env.test          # Testing environment
.env.production    # Production environment
```

### Production Build

```bash
# Frontend build
cd frontend
npm run build

# Backend build
cd ../backend
npm run build
```

### Docker Deployment

We provide a Docker setup for containerized deployment:

```yaml
# docker-compose.yml
version: '3'
services:
  mongodb:
    image: mongo:4.4
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/stockhr
      - NODE_ENV=production
    networks:
      - app-network
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:

volumes:
  mongo-data:
```

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**: Use dynamic imports for route-based code splitting
   ```tsx
   const Dashboard = React.lazy(() => import('./pages/Dashboard'));
   ```

2. **Memoization**: Use `React.memo`, `useMemo`, and `useCallback`
   ```tsx
   // Memoize expensive calculations
   const sortedItems = useMemo(() => {
     return [...items].sort((a, b) => a.name.localeCompare(b.name));
   }, [items]);
   
   // Memoize callbacks
   const handleClick = useCallback(() => {
     // Event handling logic
   }, [dependency]);
   ```

3. **Virtualization**: Use react-window for rendering large lists
   ```tsx
   import { FixedSizeList } from 'react-window';
   
   const MyList = ({ items }) => (
     <FixedSizeList
       height={500}
       width="100%"
       itemCount={items.length}
       itemSize={50}
     >
       {({ index, style }) => (
         <div style={style}>{items[index].name}</div>
       )}
     </FixedSizeList>
   );
   ```

### Backend Optimization

1. **Caching**: Implement Redis for caching frequently accessed data
2. **Database Indexing**: Add indexes to frequently queried fields
3. **Pagination**: Implement pagination for large data sets
4. **Data Compression**: Use compression middleware

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed contribution guidelines.

---

This documentation is a living document and will be updated as the project evolves. For questions or suggestions, please open an issue on the project repository. 