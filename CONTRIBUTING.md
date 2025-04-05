# Contributing to Stock & HR Management System

Thank you for considering contributing to the Stock & HR Management System! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Pull Requests](#pull-requests)
- [Development Workflow](#development-workflow)
  - [Setting Up Development Environment](#setting-up-development-environment)
  - [Branching Strategy](#branching-strategy)
  - [Commit Messages](#commit-messages)
  - [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
  - [TypeScript Guidelines](#typescript-guidelines)
  - [React Guidelines](#react-guidelines)
  - [Backend Guidelines](#backend-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

1. Use a clear and descriptive title
2. Describe the exact steps to reproduce the problem
3. Provide specific examples (e.g., screenshots or error logs)
4. Describe the behavior you observed and what you expected
5. Include details about your environment (browser, OS, app version)

Use the bug report template when creating a new issue.

### Suggesting Features

Before creating feature suggestions, please check existing issues to avoid duplicates. When creating a feature request, include:

1. Use a clear and descriptive title
2. Provide a detailed description of the suggested feature
3. Explain why this feature would be useful to most users
4. Provide examples of how the feature would work
5. Specify which part of the application the feature belongs to

Use the feature request template when creating a new issue.

### Pull Requests

1. Follow all instructions in the [Pull Request Process](#pull-request-process)
2. Follow the [Coding Standards](#coding-standards)
3. After submitting your pull request, verify that all status checks are passing

## Development Workflow

### Setting Up Development Environment

See the [Developer Guide](docs/DEVELOPER_GUIDE.md) for detailed instructions on setting up the development environment.

### Branching Strategy

We use a simplified Git Flow workflow:

- `main` - Production code, always stable
- `develop` - Development branch, contains approved changes for the next release
- `feature/feature-name` - Feature branches, created from `develop`
- `bugfix/bug-name` - Bugfix branches, created from `develop`
- `release/vX.Y.Z` - Release branches, created from `develop`
- `hotfix/issue-name` - Hotfix branches, created from `main`

### Commit Messages

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

### Pull Request Process

1. Create a branch from `develop` using the naming convention above
2. Make your changes following the coding standards
3. Ensure all tests pass and add new tests for new functionality
4. Update documentation as needed
5. Push your branch to the repository
6. Create a pull request to `develop` branch
7. Fill out the pull request template
8. Request a review from at least one maintainer
9. Make any requested changes
10. Once approved, your PR will be merged by a maintainer

## Coding Standards

### TypeScript Guidelines

- Use strict typing (`"strict": true` in tsconfig.json)
- Use interfaces for defining shapes of objects
- Avoid `any` type, use more specific types
- Use const assertions for literal values
- Document public APIs with JSDoc comments
- Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

### React Guidelines

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use TypeScript interfaces for props and state
- Use React.memo() for performance-critical components
- Extract complex logic into custom hooks
- Follow the folder structure outlined in the [Developer Guide](docs/DEVELOPER_GUIDE.md)

### Backend Guidelines

- Follow RESTful API design principles
- Implement proper error handling for all routes
- Use async/await for asynchronous operations
- Implement input validation for all API endpoints
- Document API endpoints with OpenAPI/Swagger
- Use environment variables for configuration

## Testing Guidelines

### Frontend Testing

- Write unit tests for components using React Testing Library
- Write integration tests for complex interactions
- Ensure tests are isolated and don't depend on each other
- Mock external dependencies
- Aim for high test coverage of critical functionality

Example:
```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Backend Testing

- Write unit tests for individual functions and utilities
- Write integration tests for API endpoints
- Use a test database for integration tests
- Test both success and error cases
- Mock external services

Example:
```typescript
// users.controller.test.ts
import request from 'supertest';
import { app } from '../server';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../test-utils/db';

describe('User API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    const res = await request(app)
      .post('/api/users')
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(userData.email);
    expect(res.body).not.toHaveProperty('password');
  });
});
```

## Documentation Guidelines

- Keep documentation up-to-date with code changes
- Document APIs using OpenAPI/Swagger
- Write clear and concise documentation
- Include examples where appropriate
- Use diagrams for complex workflows
- Follow Markdown best practices

## Release Process

1. Create a release branch from `develop` named `release/vX.Y.Z`
2. Update version number in package.json and other relevant files
3. Update CHANGELOG.md with new version information
4. Make any final adjustments and fixes
5. Submit a pull request to `main`
6. Once approved and merged, create a tag with the version number
7. Merge changes back to `develop`

## Getting Help

If you need help with contributing, you can:

- Join our [Discord server](#) (if applicable)
- Open a discussion on GitHub
- Email the maintainers at [maintainers@example.com](mailto:maintainers@example.com)

---

Thank you for contributing to the Stock & HR Management System! Your efforts help make this project better for everyone. 