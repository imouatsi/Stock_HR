# Contributing to Stock & HR Management System

First off, thank you for considering contributing to our project! It's people like you that make this system such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Process](#development-process)
  - [Development Setup](#development-setup)
- [Style Guide](#style-guide)
  - [JavaScript/TypeScript](#javascript-typescript)
  - [React](#react)
  - [CSS](#css)
- [Testing](#testing)
- [Documentation](#documentation)
- [Questions?](#questions)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible
* Include your environment details (OS, browser version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful
* List some other applications where this enhancement exists, if applicable

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "feat: add some feature"
```

Follow our commit message conventions:
* `feat:` for new features
* `fix:` for bug fixes
* `docs:` for documentation changes
* `style:` for formatting changes
* `refactor:` for code refactoring
* `test:` for adding tests
* `chore:` for maintenance tasks

3. Push to your fork:
```bash
git push origin feature/your-feature-name
```

4. Open a Pull Request

## Development Setup

1. Install dependencies:
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

2. Set up environment variables:
```bash
# Copy environment files
cp .env.example .env
cd frontend && cp .env.example .env
cd ../backend && cp .env.example .env
```

3. Start development servers:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

## Style Guide

### JavaScript/TypeScript

* Use TypeScript for all new code
* Follow the ESLint configuration
* Use async/await instead of callbacks
* Use meaningful variable names
* Add JSDoc comments for functions
* Keep functions small and focused

### React

* Use functional components with hooks
* Keep components small and reusable
* Use TypeScript interfaces for props
* Follow the container/presenter pattern
* Use Material-UI components when possible

### CSS

* Use Material-UI's styling solution
* Follow BEM naming convention for custom CSS
* Keep styles modular and scoped
* Use theme variables for colors and spacing

## Testing

* Write unit tests for utilities and hooks
* Write integration tests for components
* Write end-to-end tests for critical paths
* Maintain test coverage above 80%

## Documentation

* Keep README.md up to date
* Document all new features
* Update API documentation
* Add comments for complex logic
* Include TypeScript types

## Questions?

Feel free to open an issue with the tag `question` if you have any questions about contributing.

Thank you for contributing to our project! 🎉 