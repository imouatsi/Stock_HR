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

This documentation should be updated as new features are added or existing ones are modified. 