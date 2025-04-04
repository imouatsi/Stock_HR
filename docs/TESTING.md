# Testing Guide

## Unit Testing
```bash
# Backend Tests
npm run test:unit
npm run test:coverage

# Frontend Tests
npm run test:components
npm run test:integration
```

## E2E Testing
```bash
# Using Cypress
npm run test:e2e

# Using Playwright
npm run test:playwright
```

## Load Testing
```bash
# Using k6
k6 run tests/performance/load-test.js

# Using Artillery
artillery run tests/performance/scenarios.yml
```
