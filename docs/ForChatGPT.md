# Stock HR System Documentation

## Project Overview
Stock HR is a comprehensive enterprise resource planning (ERP) system that combines inventory management, human resources, and accounting functionalities. The system is built using a modern tech stack with TypeScript, React, Node.js, and MongoDB.

## Tech Stack
### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for UI components
- Redux Toolkit for state management
- React Query for data fetching
- i18next for internationalization
- Chart.js and Nivo for data visualization
- Framer Motion for animations
- Tailwind CSS for styling

### Backend
- Node.js with TypeScript
- Express.js for the web server
- MongoDB with Mongoose for database
- JWT for authentication
- Socket.IO for real-time features
- PDFKit and jsPDF for PDF generation
- Nodemailer for email notifications

## Project Structure
```
stock-hr/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── hooks/       # Custom React hooks
│   │   ├── routes/      # Route definitions
│   │   ├── locales/     # Internationalization files
│   │   ├── contexts/    # React contexts
│   │   ├── theme/       # Theme configuration
│   │   ├── features/    # Redux features
│   │   ├── utils/       # Utility functions
│   │   ├── types/       # TypeScript type definitions
│   │   ├── i18n/        # i18n configuration
│   │   ├── animations/  # Animation configurations
│   │   ├── store/       # Redux store configuration
│   │   ├── lib/         # Library configurations
│   │   ├── config/      # Application configuration
│   │   ├── App.tsx      # Main application component
│   │   ├── index.tsx    # Application entry point
│   │   ├── index.css    # Global styles
│   │   ├── App.css      # Application styles
│   │   ├── logo.svg     # Application logo
│   │   ├── react-app-env.d.ts  # React environment type definitions
│   │   └── reportWebVitals.ts  # Web vitals reporting
│   ├── public/          # Static files
│   ├── package.json     # Frontend dependencies
│   └── tsconfig.json    # TypeScript configuration
├── backend/            # Node.js backend application
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── validators/  # Request validators
│   │   ├── scripts/     # Utility scripts
│   │   ├── utils/       # Utility functions
│   │   ├── middleware/  # Express middleware
│   │   ├── types/       # TypeScript type definitions
│   │   ├── routes/      # Route definitions
│   │   ├── controllers/ # Route controllers
│   │   ├── services/    # Business logic services
│   │   ├── models/      # Mongoose models
│   │   ├── api/         # API configurations
│   │   ├── config/      # Application configuration
│   │   ├── server.ts    # Server entry point
│   │   └── app.ts       # Express application setup
│   ├── uploads/         # File uploads directory
│   ├── logs/            # Application logs
│   ├── package.json     # Backend dependencies
│   └── tsconfig.json    # TypeScript configuration
├── shared/             # Shared types and utilities
├── docs/               # Project documentation
└── docker-compose.yml  # Docker configuration
```

## Detailed Architecture

### Root Directory Files
- `package.json` - Root package.json with workspace configuration
- `package-lock.json` - Dependency lock file
- `.env.example` - Example environment variables
- `docker-compose.yml` - Docker configuration for services
- `Stock_HR.code-workspace` - VS Code workspace configuration
- `.gitignore` - Git ignore rules
- `.todo.md` - Project todo list
- `readme.md` - Project readme
- `CONTRIBUTING.md` - Contribution guidelines
- `CODE_OF_CONDUCT.md` - Code of conduct
- `ForChatGPT.md` - Documentation for AI assistance

### Frontend Architecture

#### Core Files
- `frontend/src/App.tsx` - Main application component
- `frontend/src/index.tsx` - Application entry point
- `frontend/src/routes.tsx` - Route definitions
- `frontend/src/index.css` - Global styles
- `frontend/src/App.css` - Application styles
- `frontend/src/logo.svg` - Application logo
- `frontend/src/react-app-env.d.ts` - React environment type definitions
- `frontend/src/reportWebVitals.ts` - Web vitals reporting

#### Components
- `frontend/src/components/Layout.tsx` - Main layout component
- `frontend/src/components/Navigation.tsx` - Navigation component
- `frontend/src/components/Sidebar.tsx` - Sidebar component
- `frontend/src/components/NotificationBar.tsx` - Notification component
- `frontend/src/components/LanguageThemeBar.tsx` - Language and theme selector
- `frontend/src/components/Navigation/BreadcrumbTrail.tsx` - Breadcrumb navigation
- `frontend/src/components/ui/GradientButton.tsx` - Custom button component

#### Pages
- `frontend/src/pages/NotFound.tsx` - 404 page
- `frontend/src/pages/Dashboard.tsx` - Dashboard page
- `frontend/src/pages/Login.tsx` - Login page
- `frontend/src/pages/Register.tsx` - Registration page
- `frontend/src/pages/Profile.tsx` - User profile page
- `frontend/src/pages/Settings.tsx` - Settings page

#### Services
- `frontend/src/services/api.ts` - API service
- `frontend/src/services/accountingService.ts` - Accounting service
- `frontend/src/modules/shared/services/ExpenseTrackingService.ts` - Expense tracking service
- `frontend/src/modules/shared/services/EventService.ts` - Event service

#### Hooks
- `frontend/src/hooks/useTranslation.ts` - Translation hook
- `frontend/src/hooks/useAuth.ts` - Authentication hook
- `frontend/src/hooks/useTheme.ts` - Theme hook
- `frontend/src/hooks/useNotification.ts` - Notification hook

#### Store
- `frontend/src/store/index.ts` - Redux store configuration
- `frontend/src/features/auth/authSlice.ts` - Authentication slice
- `frontend/src/features/slices/settingsSlice.ts` - Settings slice

#### Theme
- `frontend/src/theme/index.ts` - Theme configuration
- `frontend/src/theme/styles.ts` - Global styles
- `frontend/src/theme/gradientStyles.ts` - Gradient styles

#### Internationalization
- `frontend/src/i18n/index.ts` - i18n configuration
- `frontend/src/locales/en.json` - English translations
- `frontend/src/locales/fr.json` - French translations
- `frontend/src/locales/ar.json` - Arabic translations

#### Types
- `frontend/src/types/index.ts` - Type definitions
- `frontend/src/types/auth.ts` - Authentication types
- `frontend/src/types/user.ts` - User types
- `frontend/src/types/expense.ts` - Expense types
- `frontend/src/types/invoice.ts` - Invoice types

### Backend Architecture

#### Core Files
- `backend/src/server.ts` - Server entry point
- `backend/src/app.ts` - Express application setup

#### Models
- `backend/src/models/user.model.ts` - User model
- `backend/src/models/department.model.ts` - Department model
- `backend/src/models/employee.model.ts` - Employee model
- `backend/src/models/inventory.model.ts` - Inventory model
- `backend/src/models/category.model.ts` - Category model
- `backend/src/models/supplier.model.ts` - Supplier model
- `backend/src/models/expense.model.ts` - Expense model
- `backend/src/models/invoice.model.ts` - Invoice model
- `backend/src/models/purchaseOrder.model.ts` - Purchase order model
- `backend/src/models/invoiceAccessToken.model.ts` - Invoice access token model
- `backend/src/models/proforma.model.ts` - Proforma model
- `backend/src/models/stockAccessToken.model.ts` - Stock access token model

#### Controllers
- `backend/src/controllers/auth.controller.ts` - Authentication controller
- `backend/src/controllers/user.controller.ts` - User controller
- `backend/src/controllers/department.controller.ts` - Department controller
- `backend/src/controllers/employee.controller.ts` - Employee controller
- `backend/src/controllers/inventory.controller.ts` - Inventory controller
- `backend/src/controllers/category.controller.ts` - Category controller
- `backend/src/controllers/supplier.controller.ts` - Supplier controller
- `backend/src/controllers/expense.controller.ts` - Expense controller
- `backend/src/controllers/invoice.controller.ts` - Invoice controller
- `backend/src/controllers/purchaseOrder.controller.ts` - Purchase order controller

#### Routes
- `backend/src/routes/auth.routes.ts` - Authentication routes
- `backend/src/routes/user.routes.ts` - User routes
- `backend/src/routes/department.routes.ts` - Department routes
- `backend/src/routes/employee.routes.ts` - Employee routes
- `backend/src/routes/inventory.routes.ts` - Inventory routes
- `backend/src/routes/category.routes.ts` - Category routes
- `backend/src/routes/supplier.routes.ts` - Supplier routes
- `backend/src/routes/expense.routes.ts` - Expense routes
- `backend/src/routes/invoice.routes.ts` - Invoice routes
- `backend/src/routes/purchaseOrder.routes.ts` - Purchase order routes

#### Services
- `backend/src/services/auth.service.ts` - Authentication service
- `backend/src/services/user.service.ts` - User service
- `backend/src/services/department.service.ts` - Department service
- `backend/src/services/employee.service.ts` - Employee service
- `backend/src/services/inventory.service.ts` - Inventory service
- `backend/src/services/category.service.ts` - Category service
- `backend/src/services/supplier.service.ts` - Supplier service
- `backend/src/services/expense.service.ts` - Expense service
- `backend/src/services/invoice.service.ts` - Invoice service
- `backend/src/services/purchaseOrder.service.ts` - Purchase order service
- `backend/src/shared/services/statusManagement.service.ts` - Status management service

#### Middleware
- `backend/src/middleware/authenticate.ts` - Authentication middleware
- `backend/src/middleware/authorize.ts` - Authorization middleware
- `backend/src/middleware/validateRequest.ts` - Request validation middleware
- `backend/src/middleware/errorHandler.ts` - Error handling middleware
- `backend/src/middleware/logger.ts` - Logging middleware
- `backend/src/middleware/rateLimiter.ts` - Rate limiting middleware

#### Utils
- `backend/src/utils/ApiError.ts` - API error utility
- `backend/src/utils/ApiResponse.ts` - API response utility
- `backend/src/utils/logger.ts` - Logger utility
- `backend/src/utils/validation.ts` - Validation utility
- `backend/src/utils/email.ts` - Email utility
- `backend/src/utils/pdf.ts` - PDF generation utility

#### Config
- `backend/src/config/database.ts` - Database configuration
- `backend/src/config/email.ts` - Email configuration
- `backend/src/config/jwt.ts` - JWT configuration
- `backend/src/config/logger.ts` - Logger configuration
- `backend/src/config/server.ts` - Server configuration

#### Scripts
- `backend/src/scripts/seed.ts` - Database seeding script
- `backend/src/scripts/checkUser.ts` - User check script
- `backend/src/scripts/testLogin.ts` - Login test script

### Documentation
- `docs/ARCHITECTURE.md` - Architecture documentation
- `docs/API.md` - API documentation
- `docs/API_DOCUMENTATION.md` - Detailed API documentation
- `docs/BEGINNERS_GUIDE.md` - Beginner's guide
- `docs/CONTRIBUTING.md` - Contribution guidelines
- `docs/DATABASE.md` - Database documentation
- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/DEVELOPER_GUIDE.md` - Developer guide
- `docs/SECURITY.md` - Security documentation
- `docs/TECHNICAL.md` - Technical documentation
- `docs/TESTING.md` - Testing documentation
- `docs/TROUBLESHOOTING.md` - Troubleshooting guide

## Key Features
1. **Inventory Management**
   - Stock tracking
   - Purchase orders
   - Stock movements
   - Categories management
   - Suppliers management

2. **Human Resources**
   - Employee management
   - Department management
   - Attendance tracking
   - Leave management
   - Document management

3. **Accounting**
   - Expense tracking
   - Invoice management
   - Financial reports
   - Payment processing
   - Budget management

4. **Common Features**
   - User authentication and authorization
   - Role-based access control
   - Real-time notifications
   - Multi-language support
   - Dark/Light theme
   - Responsive design

## Data Models
### Core Models
- User
- Department
- Employee
- InventoryItem
- Category
- Supplier
- Expense
- Invoice
- PurchaseOrder

### Status Management
All major entities (expenses, invoices, etc.) implement:
- Soft deletion
- Status tracking
- Audit trails
- User attribution

## API Structure
- RESTful endpoints
- JWT authentication
- Role-based authorization
- Request validation
- Error handling
- Rate limiting

## Development Guidelines
1. **Code Style**
   - TypeScript strict mode
   - ESLint configuration
   - Prettier formatting
   - Git hooks for pre-commit checks

2. **Testing**
   - Jest for unit testing
   - React Testing Library for component testing
   - API integration tests
   - E2E testing with Cypress

3. **Documentation**
   - API documentation
   - Component documentation
   - Setup guides
   - Deployment guides

## Deployment
- Docker containerization
- CI/CD pipeline
- Environment configuration
- Database backups
- Monitoring and logging

## Security Features
- JWT authentication
- Password hashing
- Role-based access control
- Input validation
- XSS protection
- CSRF protection
- Rate limiting

## Performance Optimizations
- Database indexing
- Caching strategies
- Lazy loading
- Code splitting
- Image optimization
- API response compression

## Recent Updates
1. Enhanced expense model with:
   - Soft deletion
   - Extended status management
   - Audit trails
   - User attribution

2. Improved invoice management with:
   - Status tracking
   - Payment processing
   - PDF generation
   - Email notifications

3. Added real-time features:
   - Live notifications
   - Stock updates
   - Status changes
   - Chat system

## Development Status
- Core features implemented
- Testing in progress
- Documentation being updated
- Performance optimization ongoing
- Security audit pending

## Next Steps
1. Complete testing suite
2. Implement remaining features
3. Performance optimization
4. Security audit
5. Documentation updates
6. User acceptance testing
7. Production deployment

## Dependencies
### Root Dependencies
- concurrently: ^8.0.0 (for running multiple scripts)

### Backend Dependencies
- express: ^4.18.2
- mongoose: ^7.0.3
- socket.io: ^4.8.1
- jsonwebtoken: ^9.0.0
- bcryptjs: ^2.4.3
- nodemailer: ^6.10.0
- multer: ^1.4.5-lts.1
- cors: ^2.8.5
- dotenv: ^16.0.3
- express-validator: ^7.2.1
- joi: ^17.9.2
- morgan: ^1.10.0
- pdfkit: ^0.13.0
- qrcode: ^1.5.1
- jspdf: ^3.0.1

### Frontend Dependencies
- react: ^18.2.0
- @mui/material: ^5.17.1
- @reduxjs/toolkit: ^2.6.1
- @tanstack/react-query: ^5.71.10
- axios: ^1.8.4
- react-router-dom: ^6.30.0
- i18next: ^24.2.3
- framer-motion: ^11.0.5
- chart.js: ^4.4.8
- formik: ^2.4.6
- yup: ^1.6.1
- tailwindcss: ^3.4.1

## Environment Variables
Required environment variables are documented in `.env.example`:
- Database connection
- JWT secrets
- Email configuration
- File upload settings
- API endpoints
- Feature flags

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development servers: `npm run dev`
5. Access the application at `http://localhost:3000`

## Contributing
Please refer to CONTRIBUTING.md for guidelines on:
- Code style
- Pull request process
- Testing requirements
- Documentation updates
- Issue reporting

## License
ISC License

# ChatGPT Interaction Guide

## Project Overview
This document provides guidelines for interacting with ChatGPT regarding the Stock & HR Management System project.

## Project Structure
```
Stock_HR/
├── frontend/          # React frontend application
├── backend/           # Node.js backend application
├── docs/             # Project documentation
└── tests/            # Test files
```

## Authentication System
The project uses a username-based authentication system with the following format:
- Superadmin: SA00000
- Admin: UA00001
- User: U00002

## Key Features
1. User Authentication
   - Username-based login
   - Role-based access control
   - JWT token management

2. User Management
   - User registration
   - Admin authorization
   - Profile management

3. Security
   - Password hashing
   - Session management
   - Input validation

## Common Tasks
When requesting assistance from ChatGPT, please specify:
1. The specific component or feature you're working on
2. Any error messages or issues you're encountering
3. The desired outcome or behavior

## Code Style
- TypeScript for both frontend and backend
- ESLint for code linting
- Prettier for code formatting
- Conventional commits for version control

## Documentation
- Keep documentation up to date
- Use clear and concise language
- Include code examples where relevant
- Follow the existing documentation structure

## Best Practices
1. Security
   - Never share sensitive information
   - Use environment variables for secrets
   - Follow security guidelines

2. Code Quality
   - Write clean, maintainable code
   - Add appropriate comments
   - Follow TypeScript best practices

3. Testing
   - Write unit tests
   - Include integration tests
   - Maintain test coverage

## Common Commands
```bash
# Development
npm run dev          # Start development server
npm run build       # Build for production
npm run test        # Run tests
npm run lint        # Run linter

# Documentation
npm run docs:api    # Generate API documentation
npm run docs:tech   # Generate technical documentation
```

## Troubleshooting
When encountering issues:
1. Check the error logs
2. Verify environment variables
3. Ensure dependencies are up to date
4. Consult the documentation

## Support
For additional assistance:
1. Check the project documentation
2. Review the error logs
3. Search for similar issues
4. Contact the development team

## Note
This document is intended to help guide interactions with ChatGPT and should be updated as the project evolves. 